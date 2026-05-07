"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Plus, Trophy, ChevronRight, ChevronLeft, Check, X as CloseIcon } from "lucide-react";
import NoteCard from "@/components/notes/NoteCard";
import UploadModal from "@/components/notes/UploadModal";
import Sidebar from "@/components/layout/Sidebar";
import BottomNavBar from "@/components/layout/BottomNavBar";
import Fuse from "fuse.js";
import { supabase } from "@/lib/supabase";

const mockNotes = [
  {
    id: "1",
    title: "Data Structures & Algorithms - Complete Semester 3 Notes",
    department: "B.Tech CSE",
    semester: 3,
    subject: "DSA",
    uploader_name: "Sricharan B",
    avg_rating: 4.8,
    upvotes: 124,
    has_summary: true,
    created_at: "2 days ago"
  },
  {
    id: "2",
    title: "Introduction to Artificial Intelligence - Module 1-4",
    department: "B.Tech AI&DS",
    semester: 4,
    subject: "AI",
    uploader_name: "Goutham G",
    avg_rating: 4.5,
    upvotes: 89,
    has_summary: true,
    created_at: "5 days ago"
  },
  {
    id: "3",
    title: "Operating Systems - Unit 2 Memory Management",
    department: "B.Tech CSE",
    semester: 4,
    subject: "OS",
    uploader_name: "Anand R",
    avg_rating: 4.2,
    upvotes: 56,
    has_summary: false,
    created_at: "1 week ago"
  },
  {
    id: "4",
    title: "Financial Accounting for Fintech Professionals",
    department: "BBA Fintech",
    semester: 2,
    subject: "Accounting",
    uploader_name: "Priya S",
    avg_rating: 4.9,
    upvotes: 210,
    has_summary: true,
    created_at: "3 days ago"
  }
];

export default function NotesPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [sem, setSem] = useState("All Semesters");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  // Auto-select department from profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("branch")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          // Map short branch to display name if needed
          const branchMap: Record<string, string> = {
            "CSE": "B.Tech CSE",
            "AIDS": "B.Tech AI&DS",
            "BBA": "BBA Fintech",
            "MCA": "MCA",
            "BCOM": "B.Com",
            "Agriculture": "B.Sc Agriculture",
            "ECE": "ECE"
          };
          setDept(branchMap[profile.branch] || "All Departments");
        }
      }
    };
    fetchProfile();
  }, []);

  const fuse = new Fuse(mockNotes, {
    keys: ["title", "subject"],
    threshold: 0.3,
  });

  const filteredNotes = useMemo(() => {
    let results = search ? fuse.search(search).map(r => r.item) : mockNotes;
    if (dept !== "All Departments") results = results.filter(n => n.department === dept);
    if (sem !== "All Semesters") results = results.filter(n => n.semester === parseInt(sem));
    return results;
  }, [search, dept, sem]);

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex flex-col lg:flex-row pb-24 lg:pb-0">
      <Sidebar />
      <BottomNavBar />
      <div className="flex-1 overflow-y-auto">
      {/* Header Section - Orange Theme */}
      <section className="bg-orange-600 py-16 px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">Smart Notes Hub</h1>
          <p className="text-white/80 text-lg max-w-2xl mb-12">
            Access, download, and share high-quality academic notes summarized by AI for your convenience.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or subject..."
                className="w-full py-4 pl-12 pr-4 text-navy focus:outline-none font-medium"
              />
            </div>
            <div className="h-full w-px bg-gray-100 hidden md:block" />
            <select 
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="px-6 py-4 text-navy font-bold focus:outline-none bg-transparent appearance-none"
            >
              <option>All Departments</option>
              <option>B.Tech CSE</option>
              <option>B.Tech AI&DS</option>
              <option>BBA Fintech</option>
              <option>MCA</option>
              <option>ECE</option>
            </select>
            <div className="h-full w-px bg-gray-100 hidden md:block" />
            <select 
              value={sem}
              onChange={(e) => setSem(e.target.value)}
              className="px-6 py-4 text-navy font-bold focus:outline-none bg-transparent appearance-none"
            >
              <option>All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
        </div>
        
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
      </section>

      {/* Top Rated Horizontal Section */}
      <section className="py-12 px-6 container mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-navy" />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-navy dark:text-white">Top Rated This Week</h2>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {mockNotes.slice(0, 3).map(note => (
            <div key={note.id} className="min-w-[300px] md:min-w-[350px]">
              <NoteCard note={note} />
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-12 px-6 container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-playfair font-bold text-navy dark:text-white">Recent Notes</h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{filteredNotes.length} Results Found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </AnimatePresence>
        </div>

        {filteredNotes.length === 0 && (
          <div className="py-24 text-center">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No notes found matching your criteria.</h3>
          </div>
        )}
      </section>

      {/* Floating Upload Button */}
      <button 
        onClick={() => setIsUploadOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gold rounded-full shadow-2xl flex items-center justify-center text-navy hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white dark:border-navy"
      >
        <Plus className="w-8 h-8 stroke-3" />
      </button>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccess={(s) => setSummary(s)} 
      />

      {/* AI Summary Toast */}
      <AnimatePresence>
        {summary && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-28 right-8 left-8 md:left-auto md:w-96 bg-navy-card border border-gold/30 rounded-2xl shadow-2xl p-6 z-50 overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-gold">
                <Check className="w-5 h-5" />
                <h4 className="font-bold uppercase tracking-widest text-sm">AI Note Summary</h4>
              </div>
              <button onClick={() => setSummary(null)} className="text-white/40 hover:text-white">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="text-white/80 text-sm space-y-2 prose prose-invert">
              {summary.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
