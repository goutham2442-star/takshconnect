"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MapPin, Phone, Box, Tag, Filter, X } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

export default function LostFoundPage() {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState("lost");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8001/api/lost-found?status=${status}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, [status]);

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-xs">
              <Box className="w-4 h-4" /> Community Support
            </div>
            <h1 className="text-5xl font-playfair font-bold text-navy dark:text-white tracking-tight">
              Lost & <span className="text-maroon">Found</span>
            </h1>
            <p className="text-gray-500 max-w-xl text-lg font-medium">
              Helping the Takshashila family reconnect with their belongings. Posts are cleared every 30 days.
            </p>
          </div>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-10 py-5 bg-maroon text-white rounded-2xl font-bold shadow-xl shadow-maroon/20 hover:scale-105 transition-all flex items-center gap-3"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? "Cancel" : "Report Item"}
          </button>
        </header>

        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 dark:bg-navy-card p-12 rounded-[40px] border-2 border-maroon/20 mb-12"
            >
              <h2 className="text-2xl font-playfair font-bold mb-8">Report an Item</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                  <select className="w-full p-4 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold">
                    <option>ID Card</option>
                    <option>Laptop</option>
                    <option>Phone</option>
                    <option>Keys</option>
                    <option>Bag</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Item Name</label>
                  <input placeholder="e.g. Blue Dell Laptop" className="w-full p-4 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold" />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                  <textarea placeholder="Any unique identifiers..." className="w-full p-4 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold h-32" />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Location Lost/Found</label>
                  <input placeholder="e.g. Canteen Block A" className="w-full p-4 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold" />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Contact Number</label>
                  <input placeholder="Your mobile number" className="w-full p-4 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold" />
                </div>
              </div>
              <button className="mt-10 px-12 py-5 bg-maroon text-white rounded-2xl font-bold shadow-lg">Submit Report</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex p-2 bg-gray-50 dark:bg-white/5 rounded-[28px] border border-gray-100 dark:border-white/10 w-fit mb-12">
          {["lost", "found"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-12 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${
                status === s ? "bg-maroon text-white shadow-lg" : "text-gray-400 hover:text-navy dark:hover:text-white"
              }`}
            >
              {s} Items
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-64 bg-gray-50 dark:bg-white/5 animate-pulse rounded-[40px]" />)
          ) : (
            items.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-50 dark:bg-navy-card p-10 rounded-[40px] border border-gray-100 dark:border-white/5 relative group hover:border-maroon/20 transition-all"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 bg-white dark:bg-navy rounded-3xl flex items-center justify-center shadow-sm">
                    <Tag className="w-8 h-8 text-maroon" />
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    item.status === "lost" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}>
                    {item.category}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-2xl font-playfair font-bold text-navy dark:text-white">{item.title}</h3>
                  <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed">{item.description}</p>
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3 text-sm font-bold text-navy dark:text-white">
                    <MapPin className="w-5 h-5 text-gold" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                    <Phone className="w-5 h-5 text-gold" />
                    {item.contact_info}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          
          {!loading && items.length === 0 && (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[40px]">
              <Box className="w-16 h-16 text-gray-200 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-400">No items reported here yet.</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
