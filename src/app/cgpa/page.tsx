"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { Calculator, Plus, Trash2, Download, Zap, Trophy, BookOpen } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function CGPAPage() {
  const [semesters, setSemesters] = useState<any[]>([
    { id: 1, subjects: [{ id: 1, name: "", credits: 4, grade: "O" }] }
  ]);
  const [activeSem, setActiveSem] = useState(1);

  const GRADE_POINTS: any = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "U": 0 };

  const calculateGPA = (subjects: any[]) => {
    const totalCredits = subjects.reduce((sum, s) => sum + Number(s.credits), 0);
    const weightedSum = subjects.reduce((sum, s) => sum + (Number(s.credits) * GRADE_POINTS[s.grade]), 0);
    return totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : "0.00";
  };

  const calculateCGPA = () => {
    const totalGPA = semesters.reduce((sum, s) => sum + Number(calculateGPA(s.subjects)), 0);
    return (totalGPA / semesters.length).toFixed(2);
  };

  const cgpaValue = Number(calculateCGPA());

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-widest text-xs">
              <Zap className="w-4 h-4" /> Academic Excellence
            </div>
            <h1 className="text-5xl font-playfair font-bold text-navy dark:text-white tracking-tight">
              CGPA <span className="text-orange-600">Calculator</span>
            </h1>
            <p className="text-gray-500 max-w-xl text-lg font-medium">
              Track your academic journey with precision. Calculated based on Takshashila University standards.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setSemesters([...semesters, { id: semesters.length + 1, subjects: [{ id: Date.now(), name: "", credits: 4, grade: "O" }] }])}
              className="px-8 py-4 bg-navy text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-colors"
            >
              <Plus className="w-5 h-5" /> Add Semester
            </button>
            <button 
              className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all"
            >
              <Download className="w-5 h-5" /> Export PDF
            </button>
          </div>
        </header>

        {/* CGPA Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-orange-600 p-10 rounded-[40px] text-white flex justify-between items-center shadow-2xl shadow-orange-600/30 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <p className="text-orange-200 font-bold uppercase tracking-widest text-xs mb-2">Current CGPA</p>
              <AnimatedCounter value={cgpaValue} />
            </div>
            <Trophy className="w-20 h-20 text-white/20 relative z-10" />
          </div>
          <div className="bg-navy p-10 rounded-[40px] text-white flex justify-between items-center shadow-2xl shadow-navy/30">
            <div>
              <p className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-2">Total Semesters</p>
              <h2 className="text-6xl font-playfair font-bold">{semesters.length}</h2>
            </div>
            <BookOpen className="w-20 h-20 text-white/10" />
          </div>
          
          <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-[40px] border border-gray-100 dark:border-white/10">
            <GradePredictor currentCGPA={cgpaValue} semestersCount={semesters.length} />
          </div>
        </div>

        {/* Semester Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
          {semesters.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSem(s.id)}
              className={`px-8 py-4 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                activeSem === s.id ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-navy hover:bg-gray-100"
              }`}
            >
              Semester {s.id}
            </button>
          ))}
        </div>

        {/* Active Semester Grid */}
        <div className="bg-gray-50 dark:bg-navy-card p-12 rounded-[40px] border border-gray-100 dark:border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-playfair font-bold text-navy dark:text-white">Semester {activeSem} Subjects</h3>
            <div className="bg-orange-50 dark:bg-orange-950/30 px-6 py-2 rounded-full text-orange-600 font-black text-sm border border-orange-100 dark:border-orange-900/50">
              GPA: {calculateGPA(semesters.find(s => s.id === activeSem).subjects)}
            </div>
          </div>

          <div className="space-y-4">
            {semesters.find(s => s.id === activeSem).subjects.map((sub: any) => (
              <div key={sub.id} className="grid grid-cols-12 gap-4 items-center bg-white dark:bg-navy p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="col-span-6">
                  <input 
                    placeholder="Subject Name"
                    className="w-full bg-transparent p-2 focus:outline-none font-bold text-navy dark:text-white"
                    value={sub.name}
                    onChange={(e) => {
                      const newSemesters = [...semesters];
                      const semIndex = newSemesters.findIndex(s => s.id === activeSem);
                      const subIndex = newSemesters[semIndex].subjects.findIndex((s: any) => s.id === sub.id);
                      newSemesters[semIndex].subjects[subIndex].name = e.target.value;
                      setSemesters(newSemesters);
                    }}
                  />
                </div>
                <div className="col-span-3">
                  <select 
                    className="w-full bg-transparent p-2 font-bold text-gray-500"
                    value={sub.credits}
                    onChange={(e) => {
                      const newSemesters = [...semesters];
                      const semIndex = newSemesters.findIndex(s => s.id === activeSem);
                      const subIndex = newSemesters[semIndex].subjects.findIndex((s: any) => s.id === sub.id);
                      newSemesters[semIndex].subjects[subIndex].credits = Number(e.target.value);
                      setSemesters(newSemesters);
                    }}
                  >
                    {[1,2,3,4,5].map(c => <option key={c} value={c}>{c} Credits</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <select 
                    className="w-full bg-transparent p-2 font-black text-orange-600"
                    value={sub.grade}
                    onChange={(e) => {
                      const newSemesters = [...semesters];
                      const semIndex = newSemesters.findIndex(s => s.id === activeSem);
                      const subIndex = newSemesters[semIndex].subjects.findIndex((s: any) => s.id === sub.id);
                      newSemesters[semIndex].subjects[subIndex].grade = e.target.value;
                      setSemesters(newSemesters);
                    }}
                  >
                    {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="col-span-1 text-right">
                  <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              const newSemesters = [...semesters];
              const semIndex = newSemesters.findIndex(s => s.id === activeSem);
              newSemesters[semIndex].subjects.push({ id: Date.now(), name: "", credits: 4, grade: "O" });
              setSemesters(newSemesters);
            }}
            className="w-full mt-8 py-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-gray-400 font-bold hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </main>
    </div>
  );
}

function AnimatedCounter({ value }: { value: number }) {
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const displayValue = useTransform(springValue, (latest) => latest.toFixed(2));

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <motion.h2 className="text-7xl font-playfair font-bold">
      {displayValue}
    </motion.h2>
  );
}

function GradePredictor({ currentCGPA, semestersCount }: { currentCGPA: number, semestersCount: number }) {
  const [targetGrade, setTargetGrade] = useState("A+");
  const [remainingSubjects, setRemainingSubjects] = useState(5);
  
  const GRADE_POINTS: any = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "U": 0 };
  
  const predictedCGPA = (
    (currentCGPA * semestersCount + (GRADE_POINTS[targetGrade] * remainingSubjects / 5)) / (semestersCount + (remainingSubjects / 5))
  ).toFixed(2);

  return (
    <div className="h-full flex flex-col justify-between">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-6 flex items-center gap-2">
        <Zap className="w-3 h-3" /> Grade Predictor
      </h4>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500">Target Grade</span>
          <select 
            value={targetGrade}
            onChange={(e) => setTargetGrade(e.target.value)}
            className="bg-transparent font-black text-navy dark:text-white outline-none"
          >
            {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500">Next {remainingSubjects} Subs</span>
          <input 
            type="number"
            value={remainingSubjects}
            onChange={(e) => setRemainingSubjects(Number(e.target.value))}
            className="w-12 bg-transparent font-black text-navy dark:text-white outline-none text-right"
          />
        </div>
        <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-end">
          <span className="text-[10px] font-black uppercase text-gray-400">Predicted CGPA</span>
          <span className="text-2xl font-playfair font-bold text-orange-600">{predictedCGPA}</span>
        </div>
      </div>
    </div>
  );
}
