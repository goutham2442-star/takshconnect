"use client";

import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Settings, 
  LogOut, 
  Briefcase, 
  Calculator, 
  MessageSquare,
  Users,
  Search,
  Zap,
  Home
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: Home, path: "/dashboard" },
    { name: "Notes Hub", icon: BookOpen, path: "/notes" },
    { name: "AI Doubt Solver", icon: Zap, path: "/ask" },
    { name: "Internships", icon: Briefcase, path: "/internships" },
    { name: "CGPA Calc", icon: Calculator, path: "/cgpa" },
    { name: "Campus Events", icon: Calendar, path: "/events" },
    { name: "Study Groups", icon: Users, path: "/groups" },
    { name: "Lost & Found", icon: Search, path: "/lost-found" },
  ];

  return (
    <aside className="w-72 bg-navy dark:bg-black p-8 flex flex-col justify-between h-screen sticky top-0 border-r border-white/5">
      <div>
        <div className="flex items-center gap-4 mb-14 group cursor-pointer" onClick={() => router.push('/dashboard')}>
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-playfair font-bold text-white tracking-tight">TakshConnect</h1>
            <span className="text-[8px] font-bold text-orange-500 uppercase tracking-[0.3em]">University AI</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item, i) => {
            const isActive = pathname === item.path;
            return (
              <button 
                key={i} 
                onClick={() => router.push(item.path)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group",
                  isActive 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-white" : "text-white/30 group-hover:text-orange-500"
                )} />
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-dot"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-6 pt-8 border-t border-white/5">
        <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-white/50 hover:text-white hover:bg-white/5 transition-all group">
          <Settings className="w-5 h-5 text-white/30 group-hover:text-gold transition-colors" />
          <span className="font-bold text-sm tracking-tight">Settings</span>
        </button>
        <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-white/50 hover:text-error hover:bg-error/10 transition-all group">
          <LogOut className="w-5 h-5 text-white/30 group-hover:text-error transition-colors" />
          <span className="font-bold text-sm tracking-tight">Logout</span>
        </button>
      </div>
    </aside>
  );
}
