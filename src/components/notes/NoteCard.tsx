"use client";

import { motion } from "framer-motion";
import { Star, ThumbsUp, Download, User, Clock, FileText } from "lucide-react";

interface Note {
  id: string;
  title: string;
  department: string;
  semester: number;
  subject: string;
  uploader_name: string;
  avg_rating: number;
  upvotes: number;
  has_summary: boolean;
  created_at: string;
}

const deptColors: Record<string, string> = {
  "B.Tech CSE": "bg-orange-600 text-white",
  "B.Tech AI&DS": "bg-gold text-navy",
  "BBA Fintech": "bg-blue-600 text-white",
  "MCA": "bg-purple-600 text-white",
};

export default function NoteCard({ note }: { note: Note }) {
  const initials = note.uploader_name.split(" ").map(n => n[0]).join("");

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-navy-card rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${deptColors[note.department] || "bg-gray-500 text-white"}`}>
          {note.department}
        </span>
        {note.has_summary && (
          <span className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
            <FileText className="w-3 h-3" />
            AI Summary
          </span>
        )}
      </div>

      <h3 className="text-lg font-playfair font-bold text-navy dark:text-white mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-600 dark:group-hover:text-gold transition-colors">
        {note.title}
      </h3>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-navy dark:text-gold border border-white/5">
          {initials}
        </div>
        <div>
          <p className="text-xs font-bold text-navy dark:text-white/80">{note.uploader_name}</p>
          <div className="flex items-center gap-1 text-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(note.avg_rating) ? "fill-gold" : "text-gray-300 dark:text-white/10"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-orange-600 dark:text-white/40 dark:hover:text-gold transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs font-bold">{note.upvotes}</span>
          </button>
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-white/20">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{note.created_at}</span>
          </div>
        </div>
        
        <button className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-navy dark:text-white hover:bg-orange-600 hover:text-white dark:hover:bg-gold dark:hover:text-navy transition-all">
          <Download className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
