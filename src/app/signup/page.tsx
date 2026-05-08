"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-navy overflow-hidden">
      {/* Sidebar (Left) */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-1/3 bg-university-blue flex-col justify-between p-12 relative"
      >
        <div className="z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-university-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair font-bold text-white leading-none">TakshConnect</h1>
              <p className="text-[10px] uppercase tracking-widest text-university-orange font-bold">Official Student Portal</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-5xl font-playfair font-bold text-white">Join the Community</h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Create your account to start sharing notes and tracking your academic progress.
            </p>
          </div>
        </div>

        <div className="z-10 text-white/40 text-sm">© 2026 Takshashila University.</div>
      </motion.div>

      {/* Form Section (Right) */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-24 bg-white dark:bg-navy">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md bg-white dark:bg-navy-card p-8 lg:p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5"
        >
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-navy dark:text-white">Verify Your Email</h3>
              <p className="text-gray-500 dark:text-white/40">We've sent a verification link to {email}. Please check your inbox.</p>
              <button onClick={() => router.push("/login")} className="text-university-orange font-bold hover:underline">Back to Login</button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-3xl font-playfair font-bold text-navy dark:text-white mb-2">Get Started</h3>
                <p className="text-gray-500 dark:text-white/40">Create your official student account</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-university-blue dark:text-university-orange mb-2 uppercase tracking-wider">College Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@example.com"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-4 pl-12 pr-4 text-navy dark:text-white focus:outline-none focus:border-university-orange dark:focus:border-university-orange transition-all font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-university-blue dark:text-university-orange mb-2 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-4 pl-12 pr-12 text-navy dark:text-white focus:outline-none focus:border-university-orange dark:focus:border-university-orange transition-all font-bold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-university-orange transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-university-orange hover:bg-university-orange-dark text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all group shadow-lg shadow-university-orange/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                </button>
              </form>

              <p className="mt-8 text-center text-gray-500 dark:text-white/40 text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-university-orange font-bold hover:underline">Login</a>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
