"use client";

import { useEffect, useRef } from "react";
import { GraduationCap, LogIn, Menu, Search } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navbarRef = useRef<HTMLElement>(null);
  const utilityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top top",
        onUpdate: (self) => {
          if (self.scroll() > 50) {
            gsap.to(navbarRef.current, {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              duration: 0.3,
            });
            gsap.to(utilityRef.current, {
              height: 0,
              opacity: 0,
              duration: 0.3,
            });
          } else {
            gsap.to(navbarRef.current, {
              backgroundColor: "rgba(255, 255, 255, 1)",
              backdropFilter: "blur(0px)",
              boxShadow: "none",
              duration: 0.3,
            });
            gsap.to(utilityRef.current, {
              height: "auto",
              opacity: 1,
              duration: 0.3,
            });
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header className="fixed top-[37px] left-0 w-full z-50 transition-all duration-300">
      {/* Utility Bar */}
      <div 
        ref={utilityRef}
        className="bg-[#111] text-white/80 text-[12px] py-2 overflow-hidden"
      >
        <div className="container mx-auto px-6 flex justify-end gap-6 uppercase tracking-wider font-semibold">
          <a href="#" className="hover:text-gold transition-colors">Examinations</a>
          <a href="#" className="hover:text-gold transition-colors">Online Fee Payment</a>
          <a href="#" className="hover:text-gold transition-colors">Student Login</a>
          <a href="#" className="hover:text-gold transition-colors">Verification</a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        ref={navbarRef}
        className="bg-white border-b border-gray-100"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-maroon p-1.5 rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-maroon font-heading text-2xl font-bold leading-none">TakshConnect</h1>
              <p className="text-[10px] text-navy/60 font-body uppercase tracking-[0.2em]">Student Super App</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {["Home", "Notes", "Internships", "Events", "CGPA", "AI Tutor", "Profile"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-navy font-body font-semibold text-sm hover:text-maroon transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 bg-maroon hover:bg-maroon-dark text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105">
              <LogIn className="w-4 h-4" />
              Login with College Email
            </button>
            <button className="lg:hidden p-2 text-navy">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
