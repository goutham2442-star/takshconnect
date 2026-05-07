"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, Check, Loader2, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (summary: string) => void;
}

export default function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState("B.Tech CSE");
  const [sem, setSem] = useState(1);
  const [subject, setSubject] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file || !title || !subject) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("notes")
        .upload(fileName, file, {
          onUploadProgress: (p: any) => setProgress((p.loaded / p.total) * 100),
        });

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage.from("notes").getPublicUrl(fileName);

      // 2. Save to DB
      const { data: noteData, error: dbError } = await supabase
        .from("notes")
        .insert({
          title,
          department: dept,
          semester: sem,
          subject,
          file_url: publicUrl,
          uploader_id: user.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 3. Trigger AI Summarization
      const response = await fetch("http://localhost:8001/api/notes/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_url: publicUrl, note_id: noteData.id }),
      });

      const aiData = await response.json();
      onSuccess(aiData.summary);
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white dark:bg-navy-card rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/5"
          >
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-orange-600 text-white">
              <h3 className="text-xl font-playfair font-bold">Upload New Note</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Note Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Unit 1: OS Fundamentals"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-navy dark:text-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-navy dark:text-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Department</label>
                  <select 
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-navy dark:text-white focus:outline-none focus:border-orange-500 transition-all"
                  >
                    <option>B.Tech CSE</option>
                    <option>B.Tech AI&DS</option>
                    <option>BBA Fintech</option>
                    <option>MCA</option>
                    <option>ECE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Semester</label>
                  <select 
                    value={sem}
                    onChange={(e) => setSem(parseInt(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-navy dark:text-white focus:outline-none focus:border-orange-500 transition-all"
                  >
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  isDragActive ? "border-gold bg-gold/5" : "border-gray-200 dark:border-white/10 hover:border-orange-500 dark:hover:border-gold"
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-orange-600 dark:text-gold mb-2" />
                    <p className="text-navy dark:text-white font-bold">{file.name}</p>
                    <p className="text-gray-400 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-300 dark:text-white/10 mb-4" />
                    <p className="text-navy dark:text-white font-bold">Click or drag PDF here</p>
                    <p className="text-gray-400 text-xs mt-1">Maximum file size: 10MB</p>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-orange-600 dark:text-gold">
                    <span>Uploading...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-orange-600 dark:bg-gold"
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={handleUpload}
                disabled={!file || !title || !subject || uploading}
                className="w-full bg-gold hover:bg-gold/90 text-navy font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Check className="w-6 h-6" />
                    Upload & Summarize
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
