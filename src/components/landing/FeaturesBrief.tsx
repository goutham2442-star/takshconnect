"use client";

import { motion } from "framer-motion";
import { BookOpen, Briefcase, Cpu } from "lucide-react";

const features = [
  {
    title: "Smart Notes Hub",
    description: "Upload, search, and AI-summarise notes by department and semester. Your knowledge, organized.",
    icon: <BookOpen className="w-8 h-8 text-gold" />,
  },
  {
    title: "Live Internship Finder",
    description: "AICTE, IBM, ISRO, Microsoft internships filtered for your branch. Careers start here.",
    icon: <Briefcase className="w-8 h-8 text-gold" />,
  },
  {
    title: "AI Doubt Solver",
    description: "Ask any subject question, get instant answers powered by Gemini AI. Your 24/7 tutor.",
    icon: <Cpu className="w-8 h-8 text-gold" />,
  },
];

export default function FeaturesBrief() {
  return (
    <section className="bg-navy py-24 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-maroon/10 blur-[120px] rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading text-white font-bold mb-4">What is TakshConnect?</h2>
          <div className="w-24 h-1 bg-gold mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-navy-card p-8 rounded-2xl border border-white/5 hover:border-maroon transition-all group"
            >
              <div className="mb-6 bg-navy-surface w-16 h-16 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-maroon/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-heading text-white font-bold mb-4">{feature.title}</h3>
              <p className="text-white/60 font-body leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
