"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Bell, 
  Zap, 
  Trophy, 
  Clock, 
  Target, 
  Briefcase,
  ChevronRight,
  TrendingUp,
  MapPin
} from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BottomNavBar from "@/components/layout/BottomNavBar";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
        const res = await fetch(`${apiUrl}/api/student/profile/${user.id}`);
        const profileData = await res.json();
        setData(profileData);
        setLoading(false);
      } catch (err) {
        console.error("Aggregation error:", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex flex-col lg:flex-row pb-24 lg:pb-0">
      <Sidebar />
      <BottomNavBar />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {/* Header: Personalized Identity */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
              <Zap className="w-4 h-4 fill-orange-600" /> Identity Verified: {data?.profile?.roll_number}
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-navy dark:text-white tracking-tight">
              Welcome back, <span className="text-orange-600">{data?.profile?.name.split(" ")[0]}</span>
            </h1>
            <p className="text-gray-500 dark:text-white/40 font-medium">
              Your academic command center is synchronized.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-navy dark:text-white relative hover:scale-105 transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-4 right-4 w-2 h-2 bg-maroon rounded-full border-2 border-white dark:border-navy shadow-[0_0_8px_#FF0000]" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center font-black text-white text-xl shadow-xl shadow-orange-600/20 border-2 border-white/10">
              {data?.profile?.name[0]}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Academic Intelligence */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Academic Radar: Exotic GPA & Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-orange-600 p-10 rounded-[48px] text-white relative overflow-hidden shadow-2xl shadow-orange-600/30 group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10">
                  <p className="text-orange-200 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Academic standing</p>
                  <div className="flex items-end gap-3 mb-2">
                    <h2 className="text-7xl font-playfair font-bold tracking-tighter">{data?.academic?.cgpa}</h2>
                    <span className="text-orange-200 font-bold mb-4">CGPA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                    <TrendingUp className="w-4 h-4" /> Top 5% of {data?.profile?.branch}
                  </div>
                </div>
                <Trophy className="absolute bottom-10 right-10 w-32 h-32 text-white/10" />
              </motion.div>

              <div className="bg-navy dark:bg-black p-10 rounded-[48px] text-white border border-white/5 relative overflow-hidden group">
                <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-6">Curriculum Pulse</p>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest text-white/60">
                      <span>Course Progress</span>
                      <span>{Math.round((data?.academic?.semester / 8) * 100)}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(data?.academic?.semester / 8) * 100}%` }}
                        className="h-full bg-gold shadow-[0_0_15px_#FFD700]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-3xl">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Attendance</p>
                      <h4 className="text-xl font-bold text-white">{data?.academic?.attendance_avg}%</h4>
                    </div>
                    <div className="p-4 bg-white/5 rounded-3xl">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Semester</p>
                      <h4 className="text-xl font-bold text-white">{data?.academic?.semester}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Roadmap */}
            <div className="bg-gray-50 dark:bg-navy-card p-10 rounded-[48px] border border-gray-100 dark:border-white/5">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-playfair font-bold text-navy dark:text-white">Active Roadmap</h3>
                <span className="bg-orange-100 dark:bg-orange-950/30 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-200/50">
                  Sem {data?.academic?.semester} Subjects
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.curriculum?.map((sub: string, i: number) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-navy rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm"
                  >
                    <div className="w-10 h-10 bg-orange-50 dark:bg-navy rounded-2xl flex items-center justify-center font-bold text-orange-600">
                      {i + 1}
                    </div>
                    <span className="font-bold text-navy dark:text-white/80">{sub}</span>
                    <ChevronRight className="ml-auto w-4 h-4 text-gray-300" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Pulse */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Today's Schedule (Exotic Timeline) */}
            <div className="bg-navy dark:bg-black p-10 rounded-[48px] text-white border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-600 via-gold to-orange-600" />
              <h3 className="text-xl font-playfair font-bold mb-8 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" /> Today's Pulse
              </h3>
              
              <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                {data?.timetable?.length > 0 ? data.timetable.map((slot: any, i: number) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 w-6 h-6 bg-navy border-2 border-orange-600 rounded-full flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-orange-600 rounded-full" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Period {slot.period} • {8 + slot.period}:00 AM</p>
                      <h4 className="font-bold text-lg group-hover:text-orange-500 transition-colors">{slot.subject}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <MapPin className="w-3.5 h-3.5" /> {slot.room}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 opacity-40">
                    <Calendar className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">No classes today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Personalized Career Match */}
            <div className="bg-gray-50 dark:bg-navy-card p-10 rounded-[48px] border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[9px] mb-4">
                <Target className="w-4 h-4" /> Career Intelligence Match
              </div>
              <h3 className="text-xl font-playfair font-bold text-navy dark:text-white mb-8">Matches for You</h3>
              
              <div className="space-y-4">
                {data?.internships?.map((intern: any, i: number) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="p-5 bg-white dark:bg-navy rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm cursor-pointer group"
                    onClick={() => router.push('/internships')}
                  >
                    <p className="text-[10px] text-orange-600 font-bold uppercase mb-1">{intern.provider}</p>
                    <h4 className="font-bold text-navy dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">{intern.title}</h4>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase">Verified</span>
                      <span className="text-[10px] text-gray-400 ml-auto flex items-center gap-1">
                         Apply <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button 
                onClick={() => router.push('/internships')}
                className="w-full mt-6 py-4 bg-navy text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-navy/20"
              >
                Explore All Opportunities
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
