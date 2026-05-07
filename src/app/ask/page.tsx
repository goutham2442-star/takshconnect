"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Trash2, History, Zap, Brain, MessageSquare, Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import ReactMarkdown from "react-markdown";

export default function AskPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input, id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8001/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content })
      });

      if (!response.body) throw new Error("No body");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";
      const aiId = (Date.now() + 1).toString();

      setMessages(prev => [...prev, { role: "assistant", content: "", id: aiId }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const content = JSON.parse(data);
              aiContent += content;
              setMessages(prev => prev.map(m => 
                m.id === aiId ? { ...m, content: aiContent } : m
              ));
            } catch (e) {}
          }
        }
      }
      
      // Save to history after completion
      setHistory(prev => [{ id: Date.now(), title: userMsg.content.slice(0, 30) + "...", date: new Date().toLocaleDateString() }, ...prev]);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Chat History Sidebar */}
        <div className="w-80 bg-gray-50 dark:bg-navy/20 border-r border-gray-100 dark:border-white/5 flex-col h-full hidden lg:flex">
          <div className="p-6">
            <button 
              onClick={() => setMessages([])}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all"
            >
              <Plus className="w-4 h-4" /> New Consultation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 mb-4">Recent Doubts</p>
            {history.map(item => (
              <button key={item.id} className="w-full text-left p-4 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-bold text-navy dark:text-white truncate">{item.title}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 ml-7">{item.date}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full relative">
          <header className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-100">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-playfair font-bold text-navy dark:text-white">TakshAssistant</h2>
                <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em]">Academic Intelligence Engine</p>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar bg-white dark:bg-navy">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-8">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 bg-orange-600 rounded-[40px] flex items-center justify-center shadow-2xl shadow-orange-600/30 relative"
                >
                  <div className="absolute inset-0 bg-orange-600 rounded-[40px] animate-ping opacity-20" />
                  <Brain className="w-12 h-12 text-white relative z-10" />
                </motion.div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-playfair font-bold text-navy dark:text-white">How can I help you, Scholar?</h3>
                  <p className="text-gray-500 dark:text-white/40 leading-relaxed text-lg font-medium">
                    Ask me anything about your university syllabus—from complex Data Structures to Engineering Physics.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {["Explain Dijkstra's Algorithm", "Normalization in DBMS", "Schrodinger's Equation"].map((q) => (
                    <button 
                      key={q}
                      onClick={() => setInput(q)}
                      className="px-6 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold hover:border-orange-600 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-6 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shrink-0 shadow-lg mt-2">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] p-8 rounded-[32px] shadow-sm ${
                  m.role === "user" 
                    ? "bg-orange-600 text-white rounded-tr-none" 
                    : "bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-tl-none border-l-4 border-l-orange-600"
                }`}>
                  <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed font-medium">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <div className="flex gap-6 justify-start">
                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shrink-0 shadow-lg mt-2 animate-pulse">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="max-w-[75%] p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] rounded-tl-none border-l-4 border-l-orange-600">
                  <div className="flex gap-1">
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white dark:bg-navy-card border-t border-gray-100 dark:border-white/5">
            <div className="max-w-4xl mx-auto relative group">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your doubt..."
                className="w-full bg-gray-50 dark:bg-navy border border-gray-200 dark:border-white/10 p-6 pr-20 rounded-[32px] shadow-sm focus:outline-none focus:border-orange-600 focus:bg-white transition-all font-medium placeholder:text-gray-400"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center mt-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">Powered by TakshConnect Academic Engine</p>
          </div>
        </div>
      </main>
    </div>
  );
}
