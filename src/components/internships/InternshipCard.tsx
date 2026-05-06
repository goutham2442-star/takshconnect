"use client";

import { motion } from "framer-motion";
import { Heart, ExternalLink, ShieldCheck, Gift } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

interface Internship {
  id: string;
  title: string;
  provider: string;
  description: string;
  branches: string[];
  duration_weeks: number;
  deadline: string;
  apply_url: string;
  source: string;
  is_free: boolean;
  has_certificate: boolean;
}

export default function InternshipCard({ internship }: { internship: Internship }) {
  const initial = internship.provider[0];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-navy-card rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-maroon/5 dark:bg-gold/5 flex items-center justify-center text-xl font-bold text-maroon dark:text-gold border border-maroon/10 dark:border-gold/10">
          {initial}
        </div>
        <div className="flex gap-2">
          {internship.is_free && (
            <span className="bg-green-100 text-green-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Gift className="w-3 h-3" /> FREE
            </span>
          )}
          {internship.has_certificate && (
            <span className="bg-gold/10 text-gold px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Certificate
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-playfair font-bold text-navy dark:text-white mb-1 group-hover:text-maroon dark:group-hover:text-gold transition-colors">
          {internship.title}
        </h3>
        <p className="text-sm font-bold text-gray-500 dark:text-white/40">{internship.provider} • {internship.source}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {internship.branches.map(b => (
          <span key={b} className="text-[10px] font-bold text-navy/60 dark:text-white/30 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md border border-gray-100 dark:border-white/5">
            {b}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-600 dark:text-white/60 line-clamp-2 mb-8 leading-relaxed">
        {internship.description}
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
        <CountdownTimer deadline={internship.deadline} />
        
        <div className="flex items-center gap-3">
          <button className="p-3 text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <a 
            href={internship.apply_url} 
            target="_blank" 
            className="flex items-center gap-2 bg-navy dark:bg-white text-white dark:text-navy px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-maroon dark:hover:bg-gold transition-all"
          >
            Apply <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
