"use client";

import { useState, useEffect } from "react";
import { Bell, ArrowRight } from "lucide-react";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8001/api/announcements")
      .then(res => res.json())
      .then(data => setAnnouncements(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="announcements" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-4">Latest Announcements</h2>
            <div className="w-20 h-1 bg-gold"></div>
          </div>
          <a href="#" className="flex items-center gap-2 text-maroon font-bold hover:gap-3 transition-all">
            View All News <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="space-y-6">
          {announcements.map((item) => (
            <div key={item.id} className={`p-6 border-l-4 ${item.color} bg-gray-50 rounded-r-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all`}>
              <div className="flex-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-maroon/60 mb-2 block">{item.tag}</span>
                <h3 className="text-xl font-bold text-navy mb-2">{item.title}</h3>
              </div>
              <div className="bg-maroon text-white px-6 py-2 rounded-xl text-center min-w-[120px] font-bold">
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
