"use client";

import { motion } from "framer-motion";
import { WifiOff, RefreshCcw, GraduationCap } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-navy-card p-12 rounded-[48px] shadow-2xl text-center space-y-8 border border-white/5"
      >
        <div className="w-24 h-24 bg-orange-600 rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-orange-600/20">
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-red-500 font-black uppercase tracking-[0.2em] text-[10px]">
            <WifiOff className="w-4 h-4" /> Connection Lost
          </div>
          <h1 className="text-4xl font-playfair font-bold text-navy dark:text-white">You're Offline</h1>
          <p className="text-gray-500 dark:text-white/40 font-medium">
            TakshConnect requires an active connection to sync your academic data. Please check your network and try again.
          </p>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-xl shadow-orange-600/30"
        >
          <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Retry Connection
        </button>

        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          TakshConnect © 2026
        </p>
      </motion.div>
    </div>
  );
}
