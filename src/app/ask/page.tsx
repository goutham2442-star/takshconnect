"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Trash2, History, Zap, Brain } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import ReactMarkdown from "react-markdown";

export default function AskPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
        const lines = chunk.split("\n");
        
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-maroon/10 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-maroon" />
            </div>
            <div>
              <h2 className="text-2xl font-playfair font-bold text-navy dark:text-white">TakshAssistant</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Elite Academic Engine</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="p-3 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-8">
              <div className="w-24 h-24 bg-maroon rounded-[40px] flex items-center justify-center shadow-2xl shadow-maroon/20">
                <Brain className="w-12 h-12 text-gold" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-playfair font-bold text-navy dark:text-white">How can I help you, Scholar?</h3>
                <p className="text-gray-500 dark:text-white/40 leading-relaxed">
                  Ask me anything about your university syllabus—from complex Data Structures to Engineering Physics. I'm here to ensure your academic excellence.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {["Explain Dijkstra's Algorithm", "Normalization in DBMS", "Schrodinger's Equation"].map((q) => (
                  <button 
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-6 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold hover:border-maroon hover:text-maroon transition-all"
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
              className={`flex gap-6 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                m.role === "user" ? "bg-gold text-navy" : "bg-maroon text-white"
              }`}>
                {m.role === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={`max-w-[75%] p-8 rounded-[32px] ${
                m.role === "user" 
                  ? "bg-navy text-white rounded-tr-none" 
                  : "bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-tl-none"
              }`}>
                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed font-medium">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 bg-gray-50 dark:bg-navy-card border-t border-gray-100 dark:border-white/5">
          <div className="max-w-4xl mx-auto relative group">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask your doubt..."
              className="w-full bg-white dark:bg-navy border border-gray-200 dark:border-white/10 p-5 pr-20 rounded-[28px] shadow-xl focus:outline-none focus:border-maroon transition-all font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-maroon text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Powered by TakshConnect Academic Engine</p>
        </div>
      </main>
    </div>
  );
}
