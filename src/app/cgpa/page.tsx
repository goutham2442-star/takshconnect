"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Plus, Trash2, Download, Zap, Trophy, BookOpen } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function CGPAPage() {
  const [semesters, setSemesters] = useState<any[]>([
    { id: 1, gpa: 0, subjects: [{ id: 1, name: "", credits: 4, grade: "O" }] }
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

  const updateSubject = (semId: number, subId: number, field: string, value: any) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semId) {
        const newSubjects = sem.subjects.map((sub: any) => 
          sub.id === subId ? { ...sub, [field]: value } : sub
        );
        return { ...sem, subjects: newSubjects };
      }
      return sem;
    }));
  };

  const addSubject = (semId: number) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semId) {
        return { ...sem, subjects: [...sem.subjects, { id: Date.now(), name: "", credits: 4, grade: "O" }] };
      }
      return sem;
    }));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("TakshConnect - Academic Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Final CGPA: ${calculateCGPA()}`, 20, 30);

    semesters.forEach((sem, i) => {
      autoTable(doc, {
        startY: 40 + (i * 60),
        head: [[`Semester ${sem.id}`, "Credits", "Grade"]],
        body: sem.subjects.map((s: any) => [s.name || "Subject", s.credits, s.grade]),
      });
    });
    doc.save("Academic_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-maroon font-bold uppercase tracking-widest text-xs">
              <Zap className="w-4 h-4" /> Academic Excellence
            </div>
            <h1 className="text-5xl font-playfair font-bold text-navy dark:text-white tracking-tight">
              CGPA <span className="text-maroon">Calculator</span>
            </h1>
            <p className="text-gray-500 max-w-xl text-lg font-medium">
              Track your academic journey with precision. Calculated based on Takshashila University standards.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setSemesters([...semesters, { id: semesters.length + 1, subjects: [{ id: Date.now(), name: "", credits: 4, grade: "O" }] }])}
              className="px-8 py-4 bg-navy text-white rounded-2xl font-bold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Semester
            </button>
            <button 
              onClick={exportPDF}
              className="px-8 py-4 bg-maroon text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-maroon/20"
            >
              <Download className="w-5 h-5" /> Export PDF
            </button>
          </div>
        </header>

        {/* CGPA Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-maroon p-10 rounded-[40px] text-white flex justify-between items-center shadow-2xl shadow-maroon/30">
            <div>
              <p className="text-gold font-bold uppercase tracking-widest text-xs mb-2">Target Academic Score</p>
              <h2 className="text-6xl font-playfair font-bold">{calculateCGPA()}</h2>
            </div>
            <Trophy className="w-20 h-20 text-gold/20" />
          </div>
          <div className="bg-navy p-10 rounded-[40px] text-white flex justify-between items-center shadow-2xl shadow-navy/30">
            <div>
              <p className="text-gold font-bold uppercase tracking-widest text-xs mb-2">Total Semesters</p>
              <h2 className="text-6xl font-playfair font-bold">{semesters.length}</h2>
            </div>
            <BookOpen className="w-20 h-20 text-white/10" />
          </div>
          
          <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-[40px] border border-gray-100 dark:border-white/10">
            <GradePredictor currentCGPA={Number(calculateCGPA())} semestersCount={semesters.length} />
          </div>
        </div>

        {/* Semester Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
          {semesters.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSem(s.id)}
              className={`px-8 py-4 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                activeSem === s.id ? "bg-maroon text-white" : "bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-navy"
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
            <div className="text-maroon font-bold">GPA: {calculateGPA(semesters.find(s => s.id === activeSem).subjects)}</div>
          </div>

          <div className="space-y-4">
            {semesters.find(s => s.id === activeSem).subjects.map((sub: any) => (
              <div key={sub.id} className="grid grid-cols-12 gap-4 items-center bg-white dark:bg-navy p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                <div className="col-span-6">
                  <input 
                    placeholder="Subject Name"
                    className="w-full bg-transparent p-2 focus:outline-none font-bold"
                    value={sub.name}
                    onChange={(e) => updateSubject(activeSem, sub.id, "name", e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <select 
                    className="w-full bg-transparent p-2 font-bold"
                    value={sub.credits}
                    onChange={(e) => updateSubject(activeSem, sub.id, "credits", e.target.value)}
                  >
                    {[1,2,3,4,5].map(c => <option key={c} value={c}>{c} Credits</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <select 
                    className="w-full bg-transparent p-2 font-bold text-maroon"
                    value={sub.grade}
                    onChange={(e) => updateSubject(activeSem, sub.id, "grade", e.target.value)}
                  >
                    {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="col-span-1 text-right">
                  <button className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => addSubject(activeSem)}
            className="w-full mt-8 py-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-gray-400 font-bold hover:border-maroon hover:text-maroon transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </main>
    </div>
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
      <h4 className="text-[10px] font-black uppercase tracking-widest text-maroon mb-6 flex items-center gap-2">
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
          <span className="text-2xl font-playfair font-bold text-maroon">{predictedCGPA}</span>
        </div>
      </div>
    </div>
  );
}
