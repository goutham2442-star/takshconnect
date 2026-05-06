"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, Heart, Share2, Sparkles, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CampusEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial events
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      
      if (!error) setEvents(data || []);
      setLoading(false);
    };

    fetchEvents();

    // 2. Subscribe to Realtime updates
    const channel = supabase
      .channel("events_realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "events" }, (payload) => {
        setEvents(prev => prev.map(ev => ev.id === payload.new.id ? payload.new : ev));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRSVP = async (id: string, currentCount: number) => {
    // Optimistic update
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, rsvp_count: currentCount + 1 } : ev));

    const { error } = await supabase
      .from("events")
      .update({ rsvp_count: currentCount + 1 })
      .eq("id", id);
    
    if (error) {
      // Rollback on error
      setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, rsvp_count: currentCount } : ev));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy pb-24">
      {/* Header */}
      <section className="bg-maroon py-20 px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-3 text-gold font-bold uppercase tracking-widest text-xs mb-4">
            <Sparkles className="w-4 h-4" /> Live Updates Enabled
          </div>
          <h1 className="text-4xl md:text-7xl font-playfair font-bold text-white mb-6">Campus <span className="text-gold">Events</span></h1>
          <p className="text-white/60 text-lg max-w-2xl">
            From technical hackathons to cultural fests. Stay updated with everything happening at Takshashila.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-80 -mt-80" />
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-96 bg-white dark:bg-navy-card rounded-3xl animate-pulse" />)
          ) : (
            events.map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-navy-card rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-xl group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={event.poster_image_url || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={event.title}
                  />
                  <div className="absolute top-4 left-4 bg-maroon text-white p-3 rounded-2xl text-center shadow-2xl min-w-[60px]">
                    <p className="text-xs font-bold uppercase tracking-widest">
                      {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </p>
                    <p className="text-2xl font-playfair font-bold">
                      {new Date(event.date).getDate()}
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold/20">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-playfair font-bold text-navy dark:text-white mb-4 group-hover:text-maroon dark:group-hover:text-gold transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-white/40">
                      <Calendar className="w-4 h-4 text-maroon dark:text-gold" />
                      {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-white/40">
                      <MapPin className="w-4 h-4 text-maroon dark:text-gold" />
                      {event.venue}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-white/40">
                      <Users className="w-4 h-4 text-maroon dark:text-gold" />
                      <span className="font-bold text-navy dark:text-white">{event.rsvp_count} Students</span> attending
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRSVP(event.id, event.rsvp_count)}
                    className="w-full bg-navy dark:bg-white text-white dark:text-navy font-bold py-4 rounded-2xl hover:bg-maroon dark:hover:bg-gold transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    RSVP Now <Sparkles className="w-4 h-4 group-hover/btn:animate-spin" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
