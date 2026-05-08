"use client";

import { useState, useEffect } from "react";
import { Bot, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hi! I'm your TakshConnect Assistant. How can I help you today?" }
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMsg = { role: "user" as const, text: message };
    setChat(prev => [...prev, userMsg]);
    setMessage("");
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
      
      // First check if server is reachable
      const healthRes = await fetch(`${apiUrl}/health`).catch(() => null);
      if (!healthRes || !healthRes.ok) {
        setChat(prev => [...prev, { role: "bot", text: "I'm having trouble connecting to my AI core. Please make sure the TakshConnect backend is running on port 8001." }]);
        return;
      }

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });
      
      if (!response.ok) throw new Error("API error");
      
      const data = await response.json();
      setChat(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      setChat(prev => [...prev, { role: "bot", text: "Sorry, I encountered an error. Please try again in a moment." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-80 md:w-96 h-[500px] bg-navy-card border border-white/10 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-university-blue/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-university-orange flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Taksh Assistant</h4>
                  <p className="text-[10px] text-university-orange flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    AI Powered
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(true)} className="p-1.5 text-white/40 hover:text-white transition-colors">
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user" 
                    ? "bg-university-blue text-white rounded-tr-none shadow-sm" 
                    : "bg-white/5 text-white/80 border border-white/10 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-navy/50">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-university-orange transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-university-orange hover:text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (isMinimized) setIsMinimized(false);
          else setIsOpen(!isOpen);
        }}
        className="w-14 h-14 rounded-full bg-university-orange shadow-lg shadow-university-orange/30 flex items-center justify-center text-white border-2 border-white/10"
      >
        {isOpen && !isMinimized ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
