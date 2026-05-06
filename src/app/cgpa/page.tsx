"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Download, Plus, Trash2, LineChart, TrendingUp, Sparkles } from "lucide-react";
import jsPDF from "jspdf";

const gradeScale: Record<string, number> = {
  "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "F": 0
};

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState<Record<number, Subject[]>>({
    1: [{ id: "1", name: "Engineering Math I", credits: 4, grade: "A+" }],
  });
  const [activeSem, setActiveSem] = useState(1);
  const [predictedGrade, setPredictedGrade] = useState("A");
  const [remainingSubjects, setRemainingSubjects] = useState(5);

  const cgpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    Object.values(semesters).forEach(subjects => {
      subjects.forEach(sub => {
        totalPoints += (sub.credits * gradeScale[sub.grade]);
        totalCredits += sub.credits;
      });
    });
    return totalCredits === 0 ? 0 : totalPoints / totalCredits;
  }, [semesters]);

  const predictedCGPA = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    Object.values(semesters).forEach(subjects => {
      subjects.forEach(sub => {
        totalPoints += (sub.credits * gradeScale[sub.grade]);
        totalCredits += sub.credits;
      });
    });
    // Add predicted subjects (assuming 3 credits each)
    totalPoints += (remainingSubjects * 3 * gradeScale[predictedGrade]);
    totalCredits += (remainingSubjects * 3);
    return totalCredits === 0 ? 0 : totalPoints / totalCredits;
  }, [semesters, predictedGrade, remainingSubjects]);

  const addSubject = () => {
    const newSub = { id: Date.now().toString(), name: "", credits: 3, grade: "A" };
    setSemesters({
      ...semesters,
      [activeSem]: [...(semesters[activeSem] || []), newSub]
    });
  };

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    const updated = semesters[activeSem].map(s => s.id === id ? { ...s, [field]: value } : s);
    setSemesters({ ...semesters, [activeSem]: updated });
  };

  const deleteSubject = (id: string) => {
    const updated = semesters[activeSem].filter(s => s.id !== id);
    setSemesters({ ...semesters, [activeSem]: updated });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("TakshConnect Academic Report", 20, 20);
    doc.setFontSize(14);
    doc.text(`Overall CGPA: ${cgpa.toFixed(2)}`, 20, 30);
    
    let y = 45;
    Object.entries(semesters).forEach(([sem, subjects]) => {
      doc.setFontSize(16);
      doc.text(`Semester ${sem}`, 20, y);
      y += 10;
      doc.setFontSize(12);
      subjects.forEach(s => {
        doc.text(`${s.name || "Untitled"} - Credits: ${s.credits} - Grade: ${s.grade}`, 30, y);
        y += 8;
      });
      y += 10;
    });
    
    doc.save("TakshConnect_GradeReport.pdf");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy py-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-navy dark:text-white mb-4">CGPA <span className="text-gold">Calculator</span></h1>
            <p className="text-gray-500 dark:text-white/40 font-bold uppercase tracking-widest text-xs">Tamil Nadu University Grading System</p>
          </div>
          <div className="flex flex-col items-end">
            <motion.div 
              key={cgpa}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl md:text-8xl font-playfair font-bold text-maroon dark:text-gold"
            >
              {cgpa.toFixed(2)}
            </motion.div>
            <p className="text-xs font-bold text-navy/40 dark:text-white/20 uppercase tracking-widest">Current CGPA</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-8">
            {/* Semester Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[1,2,3,4,5,6,7,8].map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSem(s)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                    activeSem === s ? "bg-maroon text-white shadow-xl shadow-maroon/20" : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  Semester {s}
                </button>
              ))}
            </div>

            {/* Subject List */}
            <div className="bg-gray-50 dark:bg-navy-card rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy dark:text-white">Semester {activeSem} Subjects</h3>
                <button 
                  onClick={addSubject}
                  className="bg-gold text-navy px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Plus className="w-4 h-4" /> Add Subject
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {(semesters[activeSem] || []).map((sub) => (
                    <motion.div 
                      key={sub.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10"
                    >
                      <div className="md:col-span-6">
                        <input 
                          type="text" 
                          value={sub.name}
                          onChange={(e) => updateSubject(sub.id, "name", e.target.value)}
                          placeholder="Subject Name (e.g. DSA)"
                          className="w-full bg-transparent border-none text-navy dark:text-white font-bold focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Credits</label>
                        <select 
                          value={sub.credits}
                          onChange={(e) => updateSubject(sub.id, "credits", parseInt(e.target.value))}
                          className="w-full bg-gray-50 dark:bg-navy border border-gray-100 dark:border-white/10 rounded p-1 text-xs text-navy dark:text-white font-bold"
                        >
                          {[1,2,3,4,5].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Grade</label>
                        <select 
                          value={sub.grade}
                          onChange={(e) => updateSubject(sub.id, "grade", e.target.value)}
                          className="w-full bg-gray-50 dark:bg-navy border border-gray-100 dark:border-white/10 rounded p-1 text-xs text-navy dark:text-white font-bold"
                        >
                          {Object.keys(gradeScale).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button onClick={() => deleteSubject(sub.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {(!semesters[activeSem] || semesters[activeSem].length === 0) && (
                  <div className="py-12 text-center text-gray-400 text-sm font-bold uppercase tracking-widest border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl">
                    No subjects added yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Predictor & Tools */}
          <div className="space-y-8">
            {/* Predictor */}
            <div className="bg-navy text-white p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-playfair font-bold">Grade Predictor</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase mb-2 block">If I score...</label>
                    <select 
                      value={predictedGrade}
                      onChange={(e) => setPredictedGrade(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gold font-bold"
                    >
                      {Object.keys(gradeScale).map(g => <option key={g} value={g} className="bg-navy">{g} Grade</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase mb-2 block">In next {remainingSubjects} subjects...</label>
                    <input 
                      type="range" min="1" max="20" 
                      value={remainingSubjects}
                      onChange={(e) => setRemainingSubjects(parseInt(e.target.value))}
                      className="w-full accent-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-white/20">
                      <span>1 Subject</span>
                      <span>20 Subjects</span>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-xs text-white/40 uppercase font-bold mb-1">Your predicted CGPA will be</p>
                    <span className="text-4xl font-playfair font-bold text-gold">{predictedCGPA.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-gold/5 group-hover:scale-110 transition-transform" />
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button 
                onClick={exportPDF}
                className="w-full bg-maroon hover:bg-maroon/90 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-maroon/20"
              >
                <Download className="w-5 h-5" /> Export Grade Report (PDF)
              </button>
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed px-4">
                Note: This is an unofficial calculation based on the TN University grade scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
