"use client";

import { motion } from "framer-motion";
import { Home, BookOpen, Briefcase, Calendar, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "Notes", icon: BookOpen, path: "/notes" },
    { name: "Career", icon: Briefcase, path: "/internships" },
    { name: "Events", icon: Calendar, path: "/events" },
    { name: "Profile", icon: User, path: "/onboarding" }, // Using onboarding as profile for now
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-black/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        {tabs.map((tab, i) => {
          const isActive = pathname === tab.path;
          return (
            <button 
              key={i}
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center gap-1 relative"
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "text-gray-400"
              )}>
                <tab.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-all",
                isActive ? "text-orange-600 opacity-100" : "text-gray-400 opacity-0"
              )}>
                {tab.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-dot"
                  className="absolute -top-1 w-1 h-1 bg-orange-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
