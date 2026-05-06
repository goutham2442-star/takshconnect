"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Calendar, Settings, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      {/* Sidebar */}
      <aside className="w-64 bg-maroon p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <GraduationCap className="w-8 h-8 text-gold" />
            <h1 className="text-xl font-playfair font-bold text-white">TakshConnect</h1>
          </div>
          <nav className="space-y-2">
            {[
              { name: "Overview", icon: BookOpen, active: true },
              { name: "Notes Hub", icon: BookOpen, path: "/notes" },
              { name: "Timetable", icon: Calendar, path: "/timetable" },
              { name: "Settings", icon: Settings },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => item.path && router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active ? "bg-white/10 text-gold" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-sm">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-bold text-sm">Logout</span>
        </button>
      </aside>

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
