"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight,
  Plus,
  Settings,
  MoreVertical
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const statsData = [
  { name: 'Mon', active: 400 },
  { name: 'Tue', active: 300 },
  { name: 'Wed', active: 520 },
  { name: 'Thu', active: 480 },
  { name: 'Fri', active: 610 },
  { name: 'Sat', active: 200 },
  { name: 'Sun', active: 150 },
];

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push("/dashboard");
      } else {
        setIsAdmin(true);
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex">
      <Sidebar />

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-2 text-maroon font-black uppercase tracking-[0.3em] text-[10px] mb-2">
              <ShieldCheck className="w-4 h-4" /> Admin Overlook System
            </div>
            <h1 className="text-4xl font-playfair font-bold text-navy dark:text-white">University Control Room</h1>
          </div>
          <div className="flex gap-4">
            <button className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 text-navy dark:text-white">
              <Settings className="w-6 h-6" />
            </button>
            <button className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-orange-600/20">
              <Plus className="w-5 h-5" /> Quick Announcement
            </button>
          </div>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: "Total Students", value: "4,281", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Notes Pending", value: "14", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Active Internships", value: "82", icon: Briefcase, color: "text-green-500", bg: "bg-green-50" },
            { label: "Daily Active Users", value: "612", icon: TrendingUp, color: "text-maroon", bg: "bg-maroon/5" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-navy-card p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-navy dark:text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Activity Chart */}
          <div className="lg:col-span-8 bg-white dark:bg-navy-card p-10 rounded-[48px] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-playfair font-bold text-navy dark:text-white">System Engagement</h3>
              <select className="bg-gray-50 dark:bg-white/5 border-none text-xs font-bold px-4 py-2 rounded-xl text-gray-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#999', fontSize: 12, fontWeight: 'bold' }} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(234, 88, 12, 0.05)' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="active" radius={[10, 10, 10, 10]} barSize={40}>
                    {statsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#EA580C' : '#1e293b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="lg:col-span-4 bg-white dark:bg-navy-card p-10 rounded-[48px] border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-xl font-playfair font-bold text-navy dark:text-white mb-8">Pending Approvals</h3>
            <div className="space-y-6">
              {[
                { type: "Note", title: "DSA Semester 3 Full", user: "Goutham G" },
                { type: "Internship", title: "Frontend Intern @Google", user: "System AI" },
                { type: "Event", title: "Malaria Awareness", user: "HOD CSE" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl group">
                  <div className="w-10 h-10 bg-white dark:bg-navy rounded-xl flex items-center justify-center font-black text-[10px] text-orange-600 border border-gray-100 dark:border-white/5">
                    {item.type[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-navy dark:text-white line-clamp-1">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">By {item.user}</p>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-orange-600 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-navy text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
              View All Queue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
