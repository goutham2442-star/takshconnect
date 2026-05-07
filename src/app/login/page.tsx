"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.endsWith("@takshashilauniv.ac.in")) {
      setError("Please use your official college email (@takshashilauniv.ac.in)");
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if profile exists, if not redirect to onboarding
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profile) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-navy overflow-hidden">
      {/* Sidebar (Left) - Orange Theme */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-1/3 bg-orange-600 flex-col justify-between p-12 relative"
      >
        <div className="z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair font-bold text-white leading-none">TakshConnect</h1>
              <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Student Super App</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-5xl font-playfair font-bold text-white">Student Portal</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Access your notes, internships, and academic tools in one premium dashboard.
            </p>
          </div>
        </div>

        <div className="z-10">
          <p className="text-white/40 text-sm">© 2026 Takshashila University. All rights reserved.</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy/20 rounded-full blur-3xl -ml-32 -mb-32" />
      </motion.div>

      {/* Form Section (Right) */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-24 bg-white dark:bg-navy">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md bg-white dark:bg-navy-card p-8 lg:p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5"
        >
          <div className="mb-8">
            <h3 className="text-3xl font-playfair font-bold text-navy dark:text-white mb-2">Welcome Back</h3>
            <p className="text-gray-500 dark:text-white/40">Log in to your student account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-navy dark:text-gold mb-2 uppercase tracking-wider">College Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@takshashilauniv.ac.in"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-navy dark:text-white focus:outline-none focus:border-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-navy dark:text-gold mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-navy dark:text-white focus:outline-none focus:border-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm font-semibold"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Login with College Email
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 w-full text-gray-300 dark:text-white/10">
              <div className="h-[1px] flex-1 bg-current" />
              <span className="text-xs font-bold uppercase">OR</span>
              <div className="h-[1px] flex-1 bg-current" />
            </div>
            <p className="text-gray-500 dark:text-white/40 text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-orange-600 dark:text-gold font-bold hover:underline">Sign Up</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
