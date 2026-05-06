"use client";

import { motion } from "framer-motion";
import { Check, X, AlertTriangle } from "lucide-react";

interface SubjectAttendance {
  name: string;
  present: number;
  absent: number;
}

export default function AttendanceTracker({ subjects }: { subjects: SubjectAttendance[] }) {
  return (
    <div className="bg-white dark:bg-navy-card rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-xl">
      <h2 className="text-2xl font-playfair font-bold text-navy dark:text-white mb-8">Attendance Tracker</h2>
      
      <div className="space-y-8">
        {subjects.map((sub, i) => {
          const total = sub.present + sub.absent;
          const percentage = total === 0 ? 0 : (sub.present / total) * 100;
          const classesNeeded = Math.ceil((0.75 * total - sub.present) / 0.25);
          
          return (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-bold text-navy dark:text-white">{sub.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-white/40">
                    {sub.present} Present | {sub.absent} Absent
                  </p>
                </div>
                <span className={`text-xl font-bold ${percentage < 75 ? "text-red-500" : "text-green-500"}`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${percentage < 75 ? "bg-red-500" : "bg-green-500"}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-green-100 transition-colors">
                  <Check className="w-4 h-4" /> Present
                </button>
                <button className="flex-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-100 transition-colors">
                  <X className="w-4 h-4" /> Absent
                </button>
              </div>

              {percentage < 75 && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-3 rounded-xl flex items-start gap-3 mt-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed font-semibold">
                    ⚠️ You need {classesNeeded} more classes to reach 75% in {sub.name}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
