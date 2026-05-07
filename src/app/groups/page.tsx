"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, MessageSquare, Send, BookOpen, Clock, X, Hash, UserPlus, Info } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/lib/supabase";

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupSubject, setNewGroupSubject] = useState("");
  const [user, setUser] = useState<any>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      fetchGroups();
    };
    init();
  }, []);

  useEffect(() => {
    if (activeGroup) {
      fetchMessages(activeGroup.id);
      
      const channel = supabase
        .channel(`group-${activeGroup.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `group_id=eq.${activeGroup.id}` },
          (payload: any) => {
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeGroup]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchGroups = async () => {
    const { data } = await supabase.from("groups").select("*");
    setGroups(data || []);
  };

  const fetchMessages = async (groupId: string) => {
    const { data } = await supabase.from("messages").select("*").eq("group_id", groupId).order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const createGroup = async () => {
    if (!newGroupName || !newGroupSubject || !user) return;
    
    const { data, error } = await supabase.from("groups").insert({
      name: newGroupName,
      subject: newGroupSubject,
      created_by: user.id
    }).select().single();

    if (data) {
      await supabase.from("group_members").insert({ group_id: data.id, user_id: user.id });
      setShowCreate(false);
      fetchGroups();
      setActiveGroup(data);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeGroup || !user) return;
    
    await supabase.from("messages").insert({
      group_id: activeGroup.id,
      user_id: user.id,
      content: input
    });
    setInput("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Groups List */}
        <div className="w-[400px] bg-gray-50 dark:bg-navy/20 border-r border-gray-100 dark:border-white/5 flex flex-col h-full">
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-playfair font-bold text-navy dark:text-white">Study Hub</h2>
              <button 
                onClick={() => setShowCreate(true)}
                className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <input 
                placeholder="Find a group..."
                className="w-full bg-white dark:bg-navy border border-gray-100 dark:border-white/10 p-4 pl-12 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-600 transition-all"
              />
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-4 custom-scrollbar">
            {groups.map(group => (
              <button
                key={group.id}
                onClick={() => setActiveGroup(group)}
                className={`w-full p-8 rounded-[40px] text-left transition-all group ${
                  activeGroup?.id === group.id ? "bg-white dark:bg-white/5 border-2 border-orange-600/20 shadow-xl" : "hover:bg-white/50 border-2 border-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${activeGroup?.id === group.id ? "bg-orange-600 text-white" : "bg-orange-50 dark:bg-navy text-orange-600"}`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-400">Slots: 8 Max</span>
                </div>
                <h3 className="font-playfair font-bold text-2xl text-navy dark:text-white mb-2">{group.name}</h3>
                <p className="text-orange-600 text-[10px] font-black uppercase tracking-widest">{group.subject}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-navy relative">
          {activeGroup ? (
            <>
              <header className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-navy/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-orange-600 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-orange-600/20">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-navy dark:text-white">{activeGroup.name}</h2>
                    <p className="text-orange-600 text-[10px] font-black uppercase tracking-widest">{activeGroup.subject}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="p-4 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all"><UserPlus className="w-5 h-5 text-gray-400" /></button>
                  <button className="p-4 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all"><Info className="w-5 h-5 text-gray-400" /></button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-12 space-y-6 custom-scrollbar">
                {messages.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.user_id === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[60%] p-6 rounded-[28px] shadow-sm ${
                      m.user_id === user?.id 
                        ? "bg-orange-600 text-white rounded-tr-none" 
                        : "bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-tl-none border-l-4 border-l-orange-600"
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                      <span className="text-[9px] opacity-40 mt-2 block font-black uppercase tracking-widest">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatRef} />
              </div>

              <div className="p-8 border-t border-gray-100 dark:border-white/5">
                <div className="max-w-4xl mx-auto relative">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Share your thoughts..."
                    className="w-full bg-gray-50 dark:bg-navy-card border border-gray-200 dark:border-white/10 p-6 pr-20 rounded-[32px] font-bold focus:outline-none focus:border-orange-600 transition-all placeholder:text-gray-400"
                  />
                  <button 
                    onClick={sendMessage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8 bg-white dark:bg-navy">
              <div className="w-32 h-32 bg-orange-50 dark:bg-white/5 rounded-[50px] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-orange-600/10 rounded-[50px] animate-pulse" />
                <MessageSquare className="w-16 h-16 text-orange-600" />
              </div>
              <div className="space-y-4 max-w-sm">
                <h3 className="text-3xl font-playfair font-bold text-navy dark:text-white">Collaborative Learning</h3>
                <p className="text-gray-500 dark:text-white/40 font-medium">Select a group from the hub or create your own to start sharing knowledge with fellow scholars.</p>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showCreate && (
            <div className="fixed inset-0 bg-navy/80 backdrop-blur-md z-50 flex items-center justify-center p-8">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-navy-card w-full max-w-xl p-12 rounded-[40px] shadow-2xl relative"
              >
                <button onClick={() => setShowCreate(false)} className="absolute top-8 right-8 text-gray-400 hover:text-orange-600 transition-colors"><X className="w-6 h-6" /></button>
                <h2 className="text-3xl font-playfair font-bold text-navy dark:text-white mb-10">New Study Circle</h2>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 ml-2">Circle Name</label>
                    <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="e.g. CSE - DS Masters" className="w-full p-5 bg-gray-50 dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold focus:border-orange-600 transition-all" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 ml-2">Syllabus Focus</label>
                    <input value={newGroupSubject} onChange={(e) => setNewGroupSubject(e.target.value)} placeholder="e.g. Data Structures" className="w-full p-5 bg-gray-50 dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold focus:border-orange-600 transition-all" />
                  </div>
                  <button onClick={createGroup} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-600/30 hover:bg-orange-700 transition-all">Launch Group</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
