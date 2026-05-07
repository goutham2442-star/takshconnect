"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Calendar, Settings, Bell, LogOut, Briefcase, Calculator, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-navy dark:text-white">Welcome back, Student</h2>
            <p className="text-gray-500 dark:text-white/40">Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-gray-50 dark:bg-white/5 rounded-full text-navy dark:text-white relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-maroon rounded-full border-2 border-white dark:border-navy" />
            </button>
            <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center font-bold text-navy border-2 border-white dark:border-navy shadow-lg">
              SG
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Quick Stats */}
          <div className="bg-gray-50 dark:bg-navy-card p-8 rounded-3xl border border-gray-100 dark:border-white/5">
            <h4 className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-4">Attendance Average</h4>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-playfair font-bold text-navy dark:text-white">82.4%</span>
              <span className="text-green-500 text-sm font-bold mb-1">+2.1%</span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-navy-card p-8 rounded-3xl border border-gray-100 dark:border-white/5">
            <h4 className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-4">Notes Uploaded</h4>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-playfair font-bold text-navy dark:text-white">12</span>
              <span className="text-gold text-sm font-bold mb-1">Rank #4</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
