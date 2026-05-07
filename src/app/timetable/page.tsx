"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Edit2, Check, Loader2 } from "lucide-react";
import AttendanceTracker from "@/components/timetable/AttendanceTracker";
import { supabase } from "@/lib/supabase";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const periods = Array.from({ length: 10 }, (_, i) => i + 1);

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<any>({});
  const [attendance, setAttendance] = useState<any[]>([]);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Fetch Timetable
        const ttRes = await fetch(`http://localhost:8001/api/timetable/${user.id}`);
        const ttData = await ttRes.json();
        const ttMap: any = {};
        ttData.forEach((slot: any) => {
          ttMap[`${slot.day}-${slot.period}`] = `${slot.subject}${slot.room ? ' - ' + slot.room : ''}`;
        });
        setTimetable(ttMap);

        // Fetch Attendance
        const attRes = await fetch(`http://localhost:8001/api/attendance/${user.id}`);
        const attData = await attRes.json();
        setAttendance(attData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCellClick = (dayIdx: number, period: number) => {
    const key = `${dayIdx}-${period}`;
    setEditingCell(key);
    setEditValue(timetable[key] || "");
  };

  const handleSave = async (dayIdx: number, period: number) => {
    if (!user) return;
    const key = `${dayIdx}-${period}`;
    const [subject, room] = editValue.split(" - ");
    
    await fetch("http://localhost:8001/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        day: dayIdx,
        period,
        subject: subject || "Empty",
        room: room || null
      }),
    });

    setTimetable({ ...timetable, [key]: editValue });
    setEditingCell(null);
    
    // Refresh attendance list if a new subject was added
    const attRes = await fetch(`http://localhost:8001/api/attendance/${user.id}`);
    const attData = await attRes.json();
    setAttendance(attData);
  };

  const handleMarkAttendance = async (subject: string, status: string) => {
    if (!user) return;
    await fetch("http://localhost:8001/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        subject,
        status
      }),
    });

    // Refresh attendance
    const attRes = await fetch(`http://localhost:8001/api/attendance/${user.id}`);
    const attData = await attRes.json();
    setAttendance(attData);
  };

  if (loading) return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy py-12 px-6">
      <div className="container mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-navy dark:text-white mb-4">My Schedule</h1>
          <div className="w-20 h-1 bg-orange-600"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Timetable Grid */}
          <div className="lg:col-span-2 overflow-x-auto">
            <div className="bg-white dark:bg-navy-card rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
              <div className="grid grid-cols-8 divide-x divide-gray-100 dark:divide-white/5">
                <div className="p-4 bg-orange-600 text-white font-bold text-center">Time</div>
                {days.map(day => (
                  <div key={day} className="p-4 bg-orange-600 text-white font-bold text-center uppercase tracking-widest text-xs">
                    {day}
                  </div>
                ))}
              </div>

              {periods.map(p => (
                <div key={p} className="grid grid-cols-8 divide-x divide-gray-100 dark:divide-white/5 border-t border-gray-100 dark:border-white/5">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 text-navy dark:text-white/60 text-xs font-bold flex flex-col items-center justify-center">
                    <span>P{p}</span>
                    <span className="text-[10px] opacity-50">{8 + p}:30</span>
                  </div>
                  {days.map((_, dayIdx) => {
                    const key = `${dayIdx}-${p}`;
                    const isEditing = editingCell === key;
                    return (
                      <div 
                        key={dayIdx} 
                        onClick={() => !isEditing && handleCellClick(dayIdx, p)}
                        className="p-3 min-h-[100px] hover:bg-orange-600/5 transition-colors cursor-pointer relative group"
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <input 
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full bg-white dark:bg-navy border border-orange-500 rounded p-2 text-xs text-navy dark:text-white focus:outline-none"
                              placeholder="Subject - Room"
                            />
                            <button 
                              onClick={() => handleSave(dayIdx, p)}
                              className="w-full bg-orange-600 text-white text-[10px] font-bold py-1 rounded hover:bg-orange-700"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col justify-center items-center text-center">
                            {timetable[key] ? (
                              <>
                                <p className="text-xs font-bold text-navy dark:text-white mb-1 leading-tight">{timetable[key].split(' - ')[0]}</p>
                                <p className="text-[10px] text-orange-600 dark:text-gold font-bold flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {timetable[key].split(' - ')[1] || "TBA"}
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
            <AttendanceTracker 
              subjects={attendance} 
              onMark={handleMarkAttendance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
