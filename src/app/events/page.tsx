"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Plus, Zap, Trophy, Clock } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/api/events")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-maroon font-bold uppercase tracking-widest text-xs">
              <Zap className="w-4 h-4" /> Campus Community
            </div>
            <h1 className="text-5xl font-playfair font-bold text-navy dark:text-white tracking-tight">
              Campus <span className="text-maroon">Events</span>
            </h1>
            <p className="text-gray-500 max-w-xl text-lg font-medium">
              Stay connected with everything happening at Takshashila. From elite hackathons to cultural festivals.
            </p>
          </div>
          <button className="px-10 py-5 bg-maroon text-white rounded-2xl font-bold shadow-xl shadow-maroon/20 hover:scale-105 transition-all flex items-center gap-3">
            <Plus className="w-5 h-5" /> Submit Event
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-96 bg-gray-50 dark:bg-white/5 animate-pulse rounded-[40px]" />)
          ) : (
            events.map((event, i) => (
              <EventCard key={event.id} event={event} i={i} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function EventCard({ event, i }: { event: any, i: number }) {
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
      className="group bg-gray-50 dark:bg-navy-card rounded-[40px] border border-gray-100 dark:border-white/5 overflow-hidden hover:border-maroon/20 transition-all duration-500"
    >
      <div className="h-56 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-maroon/40 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Trophy className="w-32 h-32 text-white" />
        </div>
        <div className="absolute top-6 left-6 z-20 flex justify-between w-full pr-12">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
            {event.category}
          </div>
          <div className="bg-maroon px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-3 h-3" /> {timeLeft}
          </div>
        </div>
      </div>

      <div className="p-10 space-y-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-playfair font-bold text-navy dark:text-white group-hover:text-maroon transition-colors">{event.title}</h3>
          <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed">{event.description}</p>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 text-sm font-bold text-navy dark:text-white">
            <Calendar className="w-5 h-5 text-gold" />
            {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-white/40">
            <MapPin className="w-5 h-5 text-gold" />
            {event.venue}
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
            <Users className="w-5 h-5 text-gold" />
            {event.rsvp_count} Students RSVP'd
          </div>
        </div>

        <button className="w-full py-5 bg-navy dark:bg-maroon text-white rounded-2xl font-bold hover:shadow-2xl transition-all">
          RSVP Now
        </button>
      </div>
    </motion.div>
  );
}
