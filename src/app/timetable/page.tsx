"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Edit2, Check } from "lucide-react";
import AttendanceTracker from "@/components/timetable/AttendanceTracker";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const periods = Array.from({ length: 10 }, (_, i) => i + 1);

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<any>({});
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleCellClick = (dayIdx: number, period: number) => {
    const key = `${dayIdx}-${period}`;
    setEditingCell(key);
    setEditValue(timetable[key] || "");
  };

  const handleSave = (dayIdx: number, period: number) => {
    const key = `${dayIdx}-${period}`;
    setTimetable({ ...timetable, [key]: editValue });
    setEditingCell(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy py-12 px-6">
      <div className="container mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-navy dark:text-white mb-4">My Schedule</h1>
          <div className="w-20 h-1 bg-gold"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Timetable Grid */}
          <div className="lg:col-span-2 overflow-x-auto">
            <div className="bg-white dark:bg-navy-card rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
              <div className="grid grid-cols-8 divide-x divide-gray-100 dark:divide-white/5">
                <div className="p-4 bg-maroon text-white font-bold text-center">Time</div>
                {days.map(day => (
                  <div key={day} className="p-4 bg-maroon text-white font-bold text-center uppercase tracking-widest text-xs">
                    {day}
                  </div>
                ))}
              </div>

              {periods.map(p => (
                <div key={p} className="grid grid-cols-8 divide-x divide-gray-100 dark:divide-white/5 border-t border-gray-100 dark:border-white/5">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 text-navy dark:text-white/60 text-xs font-bold flex flex-col items-center justify-center">
                    <span>P{p}</span>
                    <span className="text-[10px] opacity-50">{9 + p}:00</span>
                  </div>
                  {days.map((_, dayIdx) => {
                    const key = `${dayIdx}-${p}`;
                    const isEditing = editingCell === key;
                    return (
                      <div 
                        key={dayIdx} 
                        onClick={() => !isEditing && handleCellClick(dayIdx, p)}
                        className="p-3 min-h-[100px] hover:bg-gold/5 transition-colors cursor-pointer relative group"
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <input 
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full bg-white dark:bg-navy border border-gold rounded p-2 text-xs text-navy dark:text-white focus:outline-none"
                              placeholder="Subject - Room"
                            />
                            <button 
                              onClick={() => handleSave(dayIdx, p)}
                              className="w-full bg-gold text-navy text-[10px] font-bold py-1 rounded"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col justify-center items-center text-center">
                            {timetable[key] ? (
                              <>
                                <p className="text-xs font-bold text-navy dark:text-white mb-1">{timetable[key].split('-')[0]}</p>
                                <p className="text-[10px] text-maroon dark:text-gold font-bold flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {timetable[key].split('-')[1] || "TBA"}
                                </p>
                              </>
                            ) : (
                              <Edit2 className="w-4 h-4 text-gray-200 dark:text-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Tracker Sidebar */}
          <div>
            <AttendanceTracker subjects={[
              { name: "Operating Systems", present: 12, absent: 5 },
              { name: "Data Structures", present: 15, absent: 2 },
              { name: "Artificial Intelligence", present: 8, absent: 6 },
              { name: "Discrete Math", present: 10, absent: 4 },
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}
