"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Briefcase, Filter, ArrowUpRight, Sparkles, Clock, Heart } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

export default function InternshipBoard() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All Branches");

  useEffect(() => {
    fetch("http://localhost:8001/api/internships")
      .then(res => res.json())
      .then(data => {
        setInternships(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = internships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                         item.provider.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = branch === "All Branches" || item.branches.includes(branch);
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <section className="bg-navy py-16 px-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-[10px] mb-4">
              <Sparkles className="w-4 h-4" /> AI-Powered Career Hub
            </div>
            <h1 className="text-5xl font-playfair font-bold text-white mb-6">
              Internship <span className="text-gold">Board</span>
            </h1>
            <p className="text-white/60 text-sm max-w-xl mb-10">
              Curated opportunities from AICTE, IBM, and top global tech firms. Validated for Takshashila students.
            </p>

            <div className="max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by role or company..."
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-white text-sm focus:outline-none font-medium"
                />
              </div>
              <div className="h-full w-[1px] bg-white/10 hidden md:block" />
              <select 
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="px-6 py-4 text-gold font-bold focus:outline-none bg-transparent appearance-none text-xs"
              >
                <option className="bg-navy">All Branches</option>
                <option className="bg-navy">B.Tech CSE</option>
                <option className="bg-navy">B.Tech AI&DS</option>
                <option className="bg-navy">ECE</option>
                <option className="bg-navy">BBA Fintech</option>
              </select>
            </div>
          </div>
        </section>

        {/* Grid Section */}
        <section className="p-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-gray-50 dark:bg-white/5 animate-pulse rounded-[32px]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filtered.map((item, i) => (
                  <InternshipCard key={item.id} item={item} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function InternshipCard({ item, index }: { item: any, index: number }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [timerColor, setTimerColor] = useState("text-green-500");

  useEffect(() => {
    const updateTimer = () => {
      const deadline = new Date(item.deadline).getTime();
      const now = new Date().getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        setTimerColor("text-red-500");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${mins}m`);

      if (days < 3) setTimerColor("text-red-500");
      else if (days < 7) setTimerColor("text-amber-500");
      else setTimerColor("text-green-500");
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [item.deadline]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gray-50 dark:bg-navy-card rounded-[32px] border border-gray-100 dark:border-white/5 p-8 group hover:border-maroon/20 transition-all flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-white dark:bg-navy rounded-2xl flex items-center justify-center shadow-sm font-black text-maroon text-xl">
          {item.provider[0]}
        </div>
        <div className="flex gap-2">
          {item.is_free && <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase">Free</span>}
          {item.has_certificate && <span className="bg-gold/10 text-gold px-3 py-1 rounded-lg text-[9px] font-black uppercase">Certificate</span>}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <h3 className="text-xl font-bold text-navy dark:text-white line-clamp-1">{item.title}</h3>
        <p className="text-maroon font-bold text-xs uppercase tracking-widest">{item.provider}</p>
      </div>

      <p className="text-gray-500 dark:text-white/40 text-sm line-clamp-2 mb-6 flex-1">{item.description}</p>

      <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <Clock className="w-4 h-4" />
            <span className={timerColor}>{timeLeft}</span>
          </div>
          <button className="text-gray-300 hover:text-maroon transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-3">
          <a 
            href={item.apply_url} 
            target="_blank" 
            className="flex-1 bg-maroon text-white py-4 rounded-2xl font-bold text-sm text-center hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Apply Now <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
