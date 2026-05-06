"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MapPin, Phone, Info, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LostAndFound() {
  const [items, setItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "ID card",
    description: "",
    location: "",
    contact_info: "",
    status: "lost"
  });

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lost_found_posts")
      .select("*")
      .eq("status", activeTab)
      .order("created_at", { ascending: false });
    
    if (!error) setItems(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("lost_found_posts")
      .insert([formData]);
    
    if (!error) {
      setIsModalOpen(false);
      fetchItems();
      setFormData({ title: "", category: "ID card", description: "", location: "", contact_info: "", status: "lost" });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy pb-24">
      {/* Header */}
      <section className="bg-gray-50 dark:bg-navy-card py-20 px-6 border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-navy dark:text-white mb-4">Lost & <span className="text-maroon">Found</span></h1>
              <p className="text-gray-500 dark:text-white/40 font-bold uppercase tracking-widest text-xs">Campus Community Assistance Portal</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-maroon text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-maroon/20"
            >
              <Plus className="w-5 h-5" /> Report an Item
            </button>
          </div>
        </div>
      </section>

      {/* Tabs & Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl flex gap-1">
            <button 
              onClick={() => setActiveTab("lost")}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "lost" ? "bg-white dark:bg-maroon text-maroon dark:text-white shadow-sm" : "text-gray-500 hover:text-navy dark:hover:text-white"
              }`}
            >
              Lost Items
            </button>
            <button 
              onClick={() => setActiveTab("found")}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "found" ? "bg-white dark:bg-maroon text-maroon dark:text-white shadow-sm" : "text-gray-500 hover:text-navy dark:hover:text-white"
              }`}
            >
              Found Items
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-50 dark:bg-white/5 rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-navy-card p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    activeTab === "lost" ? "bg-red-50 text-red-500 border border-red-100" : "bg-green-50 text-green-500 border border-green-100"
                  }`}>
                    {item.category}
                  </span>
                  <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>

                <h3 className="text-xl font-playfair font-bold text-navy dark:text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-white/40 mb-6 line-clamp-2">{item.description}</p>

                <div className="space-y-3 pt-6 border-t border-gray-50 dark:border-white/5">
                  <div className="flex items-center gap-3 text-xs text-navy dark:text-white font-bold">
                    <MapPin className="w-4 h-4 text-maroon" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-navy dark:text-white font-bold">
                    <Phone className="w-4 h-4 text-maroon" />
                    {item.contact_info}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="py-24 text-center">
            <Info className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No {activeTab} items reported yet.</h3>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl bg-white dark:bg-navy-card rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-maroon text-white">
                <h2 className="text-2xl font-playfair font-bold">Report an Item</h2>
                <p className="text-xs text-white/60 uppercase font-bold tracking-widest mt-1">Provide accurate details to help the community</p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm text-navy dark:text-white font-bold focus:outline-none"
                    >
                      <option value="lost">Lost Item</option>
                      <option value="found">Found Item</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm text-navy dark:text-white font-bold focus:outline-none"
                    >
                      {['ID card', 'laptop', 'phone', 'keys', 'bag', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Blue Dell Laptop"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm text-navy dark:text-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Location</label>
                  <input 
                    type="text" 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Block 4, Room 102"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm text-navy dark:text-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Contact Info</label>
                  <input 
                    type="text" 
                    required
                    value={formData.contact_info}
                    onChange={(e) => setFormData({...formData, contact_info: e.target.value})}
                    placeholder="Roll Number or Phone"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm text-navy dark:text-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Add more details..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm text-navy dark:text-white font-bold focus:outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-maroon text-white font-bold py-4 rounded-2xl hover:bg-maroon/90 transition-all mt-4"
                >
                  Submit Report
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
