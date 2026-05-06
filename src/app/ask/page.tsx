"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Trash2, MessageSquare, Sparkles, Sidebar as SidebarIcon, Plus } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIDoubtSolver() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am TakshAssistant. How can I help you with your studies today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8001/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.body) throw new Error("No body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      setIsTyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = assistantContent;
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-navy overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-gray-50 dark:bg-navy-card border-r border-gray-100 dark:border-white/5 flex flex-col hidden md:flex">
        <div className="p-6">
          <button className="w-full bg-maroon text-white rounded-xl py-3 px-4 font-bold flex items-center justify-center gap-2 hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20">
            <Plus className="w-5 h-5" /> New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Chats</div>
          {[
            "DSA Time Complexity",
            "Operating Systems Unit 2",
            "DBMS Normalization",
            "Engineering Math IV"
          ].map((chat, i) => (
            <button key={i} className="w-full text-left p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 text-navy dark:text-white/60 font-bold text-sm flex items-center gap-3 transition-all group">
              <MessageSquare className="w-4 h-4 opacity-40 group-hover:opacity-100" />
              <span className="truncate">{chat}</span>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-white/5">
          <div className="bg-gold/10 rounded-2xl p-4 border border-gold/20 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-gold" />
            <div>
              <p className="text-[10px] font-bold text-gold uppercase">Pro Plan</p>
              <p className="text-xs text-navy dark:text-white font-bold">Unlimited AI Solver</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-navy/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-navy" />
            </div>
            <div>
              <h2 className="font-playfair font-bold text-navy dark:text-white">TakshAssistant</h2>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
              </p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-navy dark:hover:text-white transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </header>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-maroon text-white" : "bg-gold text-navy"
                  }`}>
                    {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-maroon text-white shadow-lg shadow-maroon/10" 
                      : "bg-gray-50 dark:bg-navy-card text-navy dark:text-white/90 border-l-4 border-gold shadow-sm"
                  }`}>
                    {msg.content || (isTyping && i === messages.length - 1 ? (
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    ) : null)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-gray-50 dark:bg-navy-card p-4 rounded-2xl border-l-4 border-gold">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/50 dark:bg-navy/50 backdrop-blur-xl border-t border-gray-100 dark:border-white/5">
          <div className="max-w-4xl mx-auto relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about your syllabus..."
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-6 pr-16 text-navy dark:text-white focus:outline-none focus:border-maroon dark:focus:border-gold transition-all shadow-sm"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-maroon text-white p-3 rounded-xl hover:bg-maroon/90 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">
            TakshAssistant can make mistakes. Verify important information.
          </p>
        </div>
      </main>
    </div>
  );
}
