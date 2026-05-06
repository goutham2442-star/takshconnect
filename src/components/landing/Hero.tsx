"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MoveRight, Play } from "lucide-react";

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animation
      gsap.from(".reveal-text", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      });

      // Pin and fade on scroll
      gsap.to(textRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=400",
          scrub: true,
        },
        opacity: 0,
        y: -50,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-24">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-students-walking-on-a-university-campus-4437-large.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-navy/65" />
      </div>

      {/* Content */}
      <div ref={textRef} className="relative z-10 text-center px-6 max-w-5xl">
        <h1 className="reveal-text text-5xl md:text-7xl lg:text-8xl font-heading text-white font-bold mb-6 leading-tight">
          Fly High with <span className="text-gold">TakshConnect</span>
        </h1>
        <p className="reveal-text text-lg md:text-xl text-white/80 font-body mb-10 max-w-2xl mx-auto">
          Your smart student companion — Notes, Internships, AI Tutor, and more. 
          Everything a Takshashila student needs to succeed.
        </p>
        <div className="reveal-text flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-maroon hover:bg-maroon-light text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all group">
            Get Started
            <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto border-2 border-gold text-gold hover:bg-gold hover:text-navy px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all">
            <Play className="w-4 h-4 fill-current" />
            Watch Demo
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-[2px] h-12 bg-white/20 relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gold animate-bounce" />
        </div>
        <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Scroll to explore</span>
      </div>
    </section>
  );
}
