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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-navy">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none"
          src="https://www.youtube.com/embed/VEhqmzr8780?autoplay=1&mute=1&loop=1&playlist=VEhqmzr8780&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1"
          title="Takshashila University Login Background"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        {/* Deep Overlay for high contrast */}
        <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" />
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
        {/* Left Side: Branding & Info */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-white space-y-8 flex-1 hidden lg:block"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-[22px] bg-white flex items-center justify-center shadow-2xl shadow-white/10">
              <GraduationCap className="w-10 h-10 text-orange-600" />
            </div>
            <div>
              <h1 className="text-4xl font-playfair font-bold tracking-tight">TakshConnect</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-black">Official Student Portal</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-6xl font-playfair font-bold leading-tight">
              Fly High with <br />
              <span className="text-gold italic">Confidence.</span>
            </h2>
            <p className="text-white/70 text-xl font-medium max-w-md leading-relaxed">
              Step into your academic command center. Manage your journey with the intelligence of TakshConnect.
            </p>
          </div>

          <div className="flex items-center gap-8 pt-12 border-t border-white/10 w-fit">
            <div>
              <p className="text-3xl font-playfair font-bold text-white">40,000+</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Active Students</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-3xl font-playfair font-bold text-white">#1</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Innovator Hub</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Form Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-[480px]"
        >
          <div className="bg-white dark:bg-navy-card p-10 lg:p-14 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden group">
            {/* Gloss effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl group-hover:bg-orange-600/10 transition-all duration-700" />
            
            <div className="mb-10 text-center lg:text-left">
              <h3 className="text-4xl font-playfair font-bold text-navy dark:text-white mb-3">Welcome Back</h3>
              <p className="text-gray-500 dark:text-white/40 font-medium">Log in using your university credentials.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-navy/60 dark:text-gold/60 ml-2">College Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@takshashilauniv.ac.in"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-5 pl-14 pr-6 text-navy dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-navy transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-navy/60 dark:text-gold/60 ml-2">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-5 pl-14 pr-6 text-navy dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-navy transition-all font-bold"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }}
                  className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 rounded-xl"
                >
                  <p className="text-red-500 dark:text-red-400 text-xs font-bold text-center">
                    {error}
                  </p>
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-600/30 hover:shadow-orange-600/40 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Enter Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-12 flex flex-col items-center gap-6">
              <p className="text-gray-400 dark:text-white/20 text-xs font-bold">
                NEW TO TAKSHASHILA?{" "}
                <a href="/signup" className="text-orange-600 dark:text-gold font-black hover:underline underline-offset-4 ml-1">ENROLL NOW</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
