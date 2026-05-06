"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: "Students", value: 500, suffix: "+" },
  { label: "Schools", value: 14, suffix: "" },
  { label: "Internships", value: 1, suffix: " Lakh+" },
  { label: "AI-Powered Notes", value: 5000, suffix: "+" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
      });

      // Count up animation
      const counters = document.querySelectorAll(".counter");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target") || "0");
        gsap.to(counter, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: "power2.out",
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-maroon-dark py-12 border-y border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card text-center border-r last:border-0 border-white/10 px-4">
              <div className="text-3xl md:text-5xl font-heading text-gold font-bold mb-2">
                <span className="counter" data-target={stat.value}>0</span>
                {stat.suffix}
              </div>
              <div className="text-white/60 font-body text-xs md:text-sm uppercase tracking-widest font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
