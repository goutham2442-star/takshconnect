"use client";

import { Code, Bot, Camera, Lightbulb, ArrowUpRight } from "lucide-react";

const clubs = [
  {
    name: "Coding Club",
    desc: "Level up your dev skills with weekly hackathons and tech workshops.",
    icon: <Code className="w-8 h-8 text-gold" />,
  },
  {
    name: "Robotics Club",
    desc: "Build the future with hands-on bot building and AI integration.",
    icon: <Bot className="w-8 h-8 text-gold" />,
  },
  {
    name: "Photography Club",
    desc: "Capture the campus life through your lens. Visual storytelling at its best.",
    icon: <Camera className="w-8 h-8 text-gold" />,
  },
  {
    name: "Innovative Club",
    desc: "Turn your ideas into reality. The hub for student entrepreneurship.",
    icon: <Lightbulb className="w-8 h-8 text-gold" />,
  },
];

export default function Clubs() {
  return (
    <section className="bg-navy py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading text-white font-bold mb-4">University Clubs</h2>
          <div className="w-20 h-1 bg-gold mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {clubs.map((club, i) => (
            <div 
              key={i}
              className="bg-navy-card p-8 rounded-2xl border border-white/10 hover:border-gold transition-all group relative overflow-hidden"
            >
              {/* Icon Background Blur */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-all" />
              
              <div className="mb-6">{club.icon}</div>
              <h3 className="text-2xl font-heading text-white font-bold mb-4">{club.name}</h3>
              <p className="text-white/60 font-body text-sm mb-8 leading-relaxed">
                {club.desc}
              </p>
              <button className="flex items-center gap-2 text-gold font-bold font-body text-sm group-hover:gap-4 transition-all">
                Join via TakshConnect <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
