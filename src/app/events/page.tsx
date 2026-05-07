"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Plus, Zap, Trophy, Clock } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/lib/supabase";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.table("events").select("*").order("date", { ascending: true });
      setEvents(data || []);
      setLoading(false);
    };

    fetchEvents();

    // Realtime subscription for RSVP counts
    const channel = supabase
      .channel("events-rsvp")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "events" },
        (payload: any) => {
          setEvents(prev => prev.map(e => e.id === payload.new.id ? { ...e, rsvp_count: payload.new.rsvp_count } : e));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRSVP = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const { error } = await supabase
      .table("events")
      .update({ rsvp_count: event.rsvp_count + 1 })
      .eq("id", eventId);
      
    if (error) console.error(error);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-widest text-xs">
              <Zap className="w-4 h-4" /> Campus Community
            </div>
            <h1 className="text-5xl font-playfair font-bold text-navy dark:text-white tracking-tight">
              Campus <span className="text-orange-600">Events</span>
            </h1>
            <p className="text-gray-500 max-w-xl text-lg font-medium">
              Stay connected with everything happening at Takshashila. From elite hackathons to cultural festivals.
            </p>
          </div>
          <button className="px-10 py-5 bg-orange-600 text-white rounded-2xl font-bold shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:scale-105 transition-all flex items-center gap-3">
            <Plus className="w-5 h-5" /> Submit Event
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-96 bg-gray-50 dark:bg-white/5 animate-pulse rounded-[40px]" />)
          ) : (
            events.map((event, i) => (
              <EventCard key={event.id} event={event} i={i} onRSVP={() => handleRSVP(event.id)} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function EventCard({ event, i, onRSVP }: { event: any, i: number, onRSVP: () => void }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const eventDate = new Date(event.date).getTime();
      const now = new Date().getTime();
      const diff = eventDate - now;

      if (diff <= 0) {
        setTimeLeft("Started");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [event.date]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
      className="group bg-white dark:bg-navy-card rounded-[40px] border border-gray-100 dark:border-white/5 overflow-hidden hover:border-orange-500/20 transition-all duration-500 shadow-sm hover:shadow-2xl"
    >
      <div className="h-64 bg-navy relative overflow-hidden">
        {event.poster_image_url ? (
           <img src={event.poster_image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 to-transparent z-10" />
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <Trophy className="w-32 h-32 text-white" />
        </div>
        <div className="absolute top-6 left-6 z-20 flex justify-between w-full pr-12">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
            {event.category}
          </div>
          <div className="bg-orange-600 px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
            <Clock className="w-3 h-3" /> {timeLeft}
          </div>
        </div>
      </div>

      <div className="p-10 space-y-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-playfair font-bold text-navy dark:text-white group-hover:text-orange-600 transition-colors">{event.title}</h3>
          <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed line-clamp-3">{event.description}</p>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 text-sm font-bold text-navy dark:text-white">
            <Calendar className="w-5 h-5 text-orange-600" />
            {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-white/40">
            <MapPin className="w-5 h-5 text-orange-600" />
            {event.venue}
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
            <Users className="w-5 h-5 text-orange-600" />
            {event.rsvp_count} Students RSVP'd
          </div>
        </div>

        <button 
          onClick={onRSVP}
          className="w-full py-5 bg-navy dark:bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 hover:shadow-orange-600/30 transition-all shadow-lg"
        >
          RSVP Now
        </button>
      </div>
    </motion.div>
  );
}
