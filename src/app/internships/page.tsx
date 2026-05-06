"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Briefcase, Filter, ArrowUpRight, Sparkles } from "lucide-react";
import InternshipCard from "@/components/internships/InternshipCard";

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
    <div className="min-h-screen bg-white dark:bg-navy pb-24">
      {/* Hero Section */}
      <section className="bg-navy py-20 px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-xs mb-4">
            <Sparkles className="w-4 h-4" /> AI-Powered Listings
          </div>
          <h1 className="text-4xl md:text-7xl font-playfair font-bold text-white mb-6">
            Internship <span className="text-gold">Board</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mb-12">
            Curated internships from AICTE, IBM, Forage, and top tech companies. Updated every 24 hours.
          </p>

          <div className="max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role or company..."
                className="w-full bg-transparent py-4 pl-12 pr-4 text-white focus:outline-none font-medium"
              />
            </div>
            <div className="h-full w-[1px] bg-white/10 hidden md:block" />
            <select 
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="px-6 py-4 text-gold font-bold focus:outline-none bg-transparent appearance-none"
            >
              <option className="bg-navy">All Branches</option>
              <option className="bg-navy">B.Tech CSE</option>
              <option className="bg-navy">B.Tech AI&DS</option>
              <option className="bg-navy">ECE</option>
              <option className="bg-navy">BBA Fintech</option>
            </select>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-maroon/20 rounded-full blur-[120px] -mr-64 -mt-64" />
      </section>

      {/* Main Grid */}
      <section className="py-16 px-6 container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-maroon rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-navy dark:text-white">Available Internships</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {filtered.length} ROLES ACTIVE
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-80 bg-gray-100 dark:bg-white/5 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <InternshipCard internship={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-32 text-center">
            <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No internships found matching your criteria.</h3>
          </div>
        )}
      </section>
    </div>
  );
}
