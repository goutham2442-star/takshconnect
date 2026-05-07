"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, Plus, Search, Send, X, ChevronRight, UserPlus, BookOpen } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

export default function GroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [input, setInput] = useState("");

  const groups = [
    { id: 1, name: "Data Structures Squad", subject: "CSE201", members: 8, max: 8, sem: 4 },
    { id: 2, name: "Operating Systems 101", subject: "CSE302", members: 5, max: 8, sem: 5 },
    { id: 3, name: "Math-II Prep", subject: "MAT102", members: 3, max: 8, sem: 2 },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className="w-[450px] p-12 border-r border-gray-100 dark:border-white/5 flex flex-col">
          <header className="mb-12">
            <h1 className="text-4xl font-playfair font-bold text-navy dark:text-white mb-8">
              Study <span className="text-maroon">Groups</span>
            </h1>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                placeholder="Search subjects..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 pl-12 rounded-2xl focus:outline-none focus:border-maroon transition-all font-bold text-sm"
              />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2">
            {groups.map(group => (
              <motion.div 
                key={group.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedGroup(group)}
                className={`p-8 rounded-[40px] cursor-pointer border transition-all ${
                  selectedGroup?.id === group.id 
                    ? "bg-maroon text-white border-maroon shadow-2xl shadow-maroon/20" 
                    : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                    selectedGroup?.id === group.id ? "bg-white/10" : "bg-white dark:bg-navy"
                  }`}>
                    <BookOpen className={`w-6 h-6 ${selectedGroup?.id === group.id ? "text-gold" : "text-maroon"}`} />
                  </div>
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    selectedGroup?.id === group.id ? "bg-white/10" : "bg-gray-100"
                  }`}>
                    SEM {group.sem}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                <p className={`text-xs font-bold uppercase tracking-widest ${
                  selectedGroup?.id === group.id ? "text-gold" : "text-gray-400"
                }`}>{group.subject}</p>
                <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                   <div className="flex -space-x-2">
                     {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-navy bg-gray-200" />)}
                   </div>
                   <span className="text-[10px] font-bold opacity-60">{group.members}/{group.max} Members</span>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="mt-12 w-full py-5 bg-navy dark:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3">
            <Plus className="w-5 h-5 text-gold" /> Create New Group
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-navy-card">
          {selectedGroup ? (
            <>
              <header className="p-8 bg-white dark:bg-navy border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-maroon rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-navy dark:text-white">{selectedGroup.name}</h2>
                    <p className="text-xs text-maroon font-bold uppercase tracking-widest">Active Discussion</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-navy text-white rounded-xl font-bold text-xs flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Invite
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-black text-maroon uppercase tracking-widest ml-4">Professor Shanti</span>
                   <div className="max-w-[70%] p-6 bg-white dark:bg-navy border border-gray-100 dark:border-white/5 rounded-[32px] rounded-tl-none shadow-sm text-sm font-medium leading-relaxed">
                     Good luck with the prep today, students. Remember to focus on Chapter 4.
                   </div>
                </div>
                {/* More messages would go here */}
              </div>

              <div className="p-8 bg-white dark:bg-navy border-t border-gray-100 dark:border-white/5">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                  <input 
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 dark:bg-navy-card border border-gray-100 dark:border-white/10 p-5 rounded-2xl outline-none focus:border-maroon transition-all font-medium text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button className="w-14 h-14 bg-maroon text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-8">
              <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-[40px] flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-gray-300" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-playfair font-bold text-navy dark:text-white">Select a Squad</h3>
                <p className="text-gray-500 dark:text-white/40 leading-relaxed font-medium">
                  Collaborate with fellow scholars in real-time. Join a group or create your own to start learning together.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
