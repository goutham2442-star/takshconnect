"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Hash, GraduationCap, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const branches = [
  "B.Tech CSE", "B.Tech AI&DS", "B.Tech CSE AI&ML", "B.Tech IT", 
  "B.Tech CSE Cyber Security", "BBA Fintech", "MCA", "B.Com", 
  "B.Sc Agriculture", "ECE"
];

const years = ["1st", "2nd", "3rd", "4th"];

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [branch, setBranch] = useState(branches[0]);
  const [year, setYear] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        // Check if profile already exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (profile) router.push("/dashboard");
      }
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      name,
      roll_number: rollNumber,
      branch: branch.replace("B.Tech ", "").split(" ")[0], // Map to enum if needed, or keep as string
      year,
      email: user.email,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-university-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-university-orange/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-white dark:bg-navy-card rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/5"
      >
        <div className="bg-university-blue p-8 text-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <GraduationCap className="w-12 h-12 text-university-orange mx-auto mb-4" />
          <h2 className="text-3xl font-playfair font-bold text-white">Complete Your Profile</h2>
          <p className="text-white/60">Help us personalize your TakshConnect experience</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-university-orange" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Goutham Gagan"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-4 pl-12 pr-4 text-navy dark:text-white focus:outline-none focus:border-university-orange transition-all font-bold"
                  required
                />
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Roll Number</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-university-orange" />
                <input 
                  type="text" 
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="2026CSE001"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-4 pl-12 pr-4 text-navy dark:text-white focus:outline-none focus:border-university-orange transition-all font-bold"
                  required
                />
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Branch</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-university-orange" />
                <select 
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-4 pl-12 pr-4 text-navy dark:text-white focus:outline-none focus:border-university-orange appearance-none transition-all font-bold"
                  required
                >
                  {branches.map(b => <option key={b} value={b} className="bg-navy">{b}</option>)}
                </select>
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Year</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-university-orange" />
                <select 
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-4 pl-12 pr-4 text-navy dark:text-white focus:outline-none focus:border-university-orange appearance-none transition-all font-bold"
                  required
                >
                  {years.map((y, i) => <option key={y} value={i+1} className="bg-navy">{y} Year</option>)}
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-university-orange hover:bg-university-orange-dark text-white font-bold py-5 rounded-full flex items-center justify-center gap-3 transition-all group shadow-xl shadow-university-orange/20"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Let's Go to Dashboard
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
