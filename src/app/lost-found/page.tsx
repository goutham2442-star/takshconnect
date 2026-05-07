"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MapPin, Phone, Box, Tag, Filter, X, Upload } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/lib/supabase";

export default function LostFoundPage() {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState("lost");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "ID Card",
    description: "",
    location: "",
    contact_info: ""
  });

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data } = await supabase
        .table("lost_found")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    fetchItems();
  }, [status]);

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    const res = await fetch(`${apiUrl}/api/lost-found`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, status, user_id: user.id })
    });

    if (res.ok) {
      setShowForm(false);
      setStatus(status); // trigger refresh
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-widest text-xs">
              <Box className="w-4 h-4" /> Community Support
            </div>
            <h1 className="text-5xl font-playfair font-bold text-navy dark:text-white tracking-tight">
              Lost & <span className="text-orange-600">Found</span>
            </h1>
            <p className="text-gray-500 max-w-xl text-lg font-medium">
              Helping the Takshashila family reconnect with their belongings. Posts are cleared every 30 days.
            </p>
          </div>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-10 py-5 bg-orange-600 text-white rounded-2xl font-bold shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:scale-105 transition-all flex items-center gap-3"
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
              className="bg-gray-50 dark:bg-navy-card p-12 rounded-[40px] border-2 border-orange-600/20 mb-12 shadow-2xl shadow-orange-600/5"
            >
              <h2 className="text-3xl font-playfair font-bold mb-10 text-navy dark:text-white">Report {status === "lost" ? "Lost" : "Found"} Item</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-5 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold focus:border-orange-600 transition-colors"
                  >
                    <option>ID Card</option>
                    <option>Laptop</option>
                    <option>Phone</option>
                    <option>Keys</option>
                    <option>Bag</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Item Name</label>
                  <input 
                    placeholder="e.g. Blue Dell Laptop" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-5 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold focus:border-orange-600 transition-colors" 
                  />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Description</label>
                  <textarea 
                    placeholder="Any unique identifiers, color, or specific markings..." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-5 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold h-32 focus:border-orange-600 transition-colors" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Location {status === "lost" ? "Lost" : "Found"}</label>
                  <input 
                    placeholder="e.g. Canteen Block A" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full p-5 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold focus:border-orange-600 transition-colors" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Contact Info</label>
                  <input 
                    placeholder="Your mobile number or email" 
                    value={formData.contact_info}
                    onChange={(e) => setFormData({...formData, contact_info: e.target.value})}
                    className="w-full p-5 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-2xl outline-none font-bold focus:border-orange-600 transition-colors" 
                  />
                </div>
              </div>
              <div className="mt-10 flex items-center justify-between">
                <button className="flex items-center gap-2 text-gray-400 hover:text-orange-600 transition-colors font-bold">
                  <Upload className="w-5 h-5" /> Add Image (Optional)
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-12 py-5 bg-orange-600 text-white rounded-2xl font-bold shadow-lg hover:bg-orange-700 shadow-orange-600/20 transition-all"
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex p-2 bg-gray-100 dark:bg-white/5 rounded-[30px] border border-gray-200 dark:border-white/10 w-fit mb-12 shadow-inner">
          {["lost", "found"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-14 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all ${
                status === s ? "bg-orange-600 text-white shadow-xl shadow-orange-600/30" : "text-gray-400 hover:text-navy dark:hover:text-white"
              }`}
            >
              {s} Items
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-80 bg-gray-50 dark:bg-white/5 animate-pulse rounded-[40px]" />)
          ) : (
            items.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-navy-card p-10 rounded-[40px] border border-gray-100 dark:border-white/5 relative group hover:border-orange-500/20 transition-all shadow-sm hover:shadow-2xl"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 bg-orange-50 dark:bg-navy rounded-3xl flex items-center justify-center border border-orange-100">
                    <Tag className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    item.status === "lost" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
                  }`}>
                    {item.category}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-2xl font-playfair font-bold text-navy dark:text-white group-hover:text-orange-600 transition-colors">{item.title}</h3>
                  <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed line-clamp-3">{item.description}</p>
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3 text-sm font-bold text-navy dark:text-white">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-400 group-hover:text-navy dark:group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5 text-orange-600" />
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
