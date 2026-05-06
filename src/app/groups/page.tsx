"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, MessageCircle, Send, ArrowLeft, ChevronRight, BookOpen, GraduationCap } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function StudyGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    fetchGroups();
  }, []);

  useEffect(() => {
    if (activeGroup) {
      fetchMessages(activeGroup.id);
      
      const channel = supabase
        .channel(`group_${activeGroup.id}`)
        .on("postgres_changes", { 
          event: "INSERT", 
          schema: "public", 
          table: "group_messages",
          filter: `group_id=eq.${activeGroup.id}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeGroup]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchGroups = async () => {
    const { data, error } = await supabase.from("study_groups").select("*");
    if (!error) setGroups(data || []);
    setLoading(false);
  };

  const fetchMessages = async (groupId: string) => {
    const { data, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });
    
    if (!error) setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase
      .from("group_messages")
      .insert({
        group_id: activeGroup.id,
        user_id: user.id,
        content: newMessage
      });
    
    if (!error) setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy flex">
      {/* Sidebar - Group List */}
      <aside className={`w-full md:w-96 bg-white dark:bg-navy-card border-r border-gray-100 dark:border-white/5 flex flex-col ${activeGroup ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 border-b border-gray-100 dark:border-white/5">
          <h1 className="text-3xl font-playfair font-bold text-navy dark:text-white mb-6">Study <span className="text-gold">Groups</span></h1>
          <button className="w-full bg-maroon text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-maroon/90 transition-all shadow-xl shadow-maroon/20">
            <Plus className="w-5 h-5" /> Create New Group
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Groups</div>
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-20 bg-gray-50 dark:bg-white/5 rounded-2xl animate-pulse" />)
          ) : (
            groups.map(group => (
              <button 
                key={group.id}
                onClick={() => setActiveGroup(group)}
                className={`w-full text-left p-6 rounded-3xl transition-all border ${
                  activeGroup?.id === group.id 
                    ? "bg-maroon text-white border-maroon shadow-xl shadow-maroon/20" 
                    : "bg-white dark:bg-white/5 text-navy dark:text-white/60 border-gray-100 dark:border-white/5 hover:border-gold/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{group.name}</h3>
                  <Users className={`w-4 h-4 ${activeGroup?.id === group.id ? 'text-gold' : 'text-gray-300'}`} />
                </div>
                <div className="flex items-center gap-2 text-[10px] opacity-60 font-bold uppercase tracking-wider">
                  <BookOpen className="w-3 h-3" /> {group.subject}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={`flex-1 flex flex-col bg-white dark:bg-navy ${!activeGroup ? 'hidden md:flex' : 'flex'}`}>
        {activeGroup ? (
          <>
            {/* Chat Header */}
            <header className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 bg-white/50 dark:bg-navy/50 backdrop-blur-xl">
              <button onClick={() => setActiveGroup(null)} className="md:hidden p-2 text-gray-400">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20">
                <GraduationCap className="w-7 h-7 text-navy" />
              </div>
              <div>
                <h2 className="font-playfair font-bold text-navy dark:text-white text-lg">{activeGroup.name}</h2>
                <p className="text-[10px] text-gray-500 dark:text-white/40 font-bold uppercase tracking-widest">{activeGroup.subject} • Sem {activeGroup.semester}</p>
              </div>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((msg, i) => {
                const isMe = msg.user_id === user?.id;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`p-4 rounded-2xl text-sm ${
                        isMe 
                          ? 'bg-maroon text-white rounded-tr-none shadow-lg shadow-maroon/10' 
                          : 'bg-gray-100 dark:bg-navy-card text-navy dark:text-white/90 rounded-tl-none border-l-4 border-gold'
                      }`}>
                        {msg.content}
                      </div>
                      <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-8 bg-white/50 dark:bg-navy/50 backdrop-blur-xl border-t border-gray-100 dark:border-white/5">
              <div className="flex gap-4 max-w-4xl mx-auto">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-6 text-navy dark:text-white focus:outline-none focus:border-gold transition-all"
                />
                <button 
                  onClick={sendMessage}
                  className="bg-gold text-navy p-4 rounded-2xl hover:bg-gold/90 transition-all shadow-lg shadow-gold/20"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8">
              <MessageCircle className="w-12 h-12 text-gray-200 dark:text-white/10" />
            </div>
            <h2 className="text-3xl font-playfair font-bold text-navy dark:text-white mb-4">Select a Study Group</h2>
            <p className="text-gray-500 dark:text-white/40 max-w-sm font-medium">Collaborate with your peers in real-time. Shared learning is effective learning.</p>
          </div>
        )}
      </main>
    </div>
  );
}
