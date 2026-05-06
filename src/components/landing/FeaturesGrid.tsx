"use client";

import { motion } from "framer-motion";
import { 
  BookMarked, 
  Target, 
  Bot, 
  Calculator, 
  Calendar, 
  Users 
} from "lucide-react";

const tiles = [
  {
    title: "Notes Library",
    desc: "Department-wise organised study material",
    icon: <BookMarked className="w-6 h-6 text-gold" />,
  },
  {
    title: "Internship Board",
    desc: "Live free internships with deadline alerts",
    icon: <Target className="w-6 h-6 text-gold" />,
  },
  {
    title: "AI Tutor",
    desc: "Subject-aware Gemini-powered doubt solver",
    icon: <Bot className="w-6 h-6 text-gold" />,
  },
  {
    title: "CGPA Calculator",
    desc: "Live grade predictor with PDF export",
    icon: <Calculator className="w-6 h-6 text-gold" />,
  },
  {
    title: "Timetable + Attendance",
    desc: "Auto-warn below 75% attendance",
    icon: <Calendar className="w-6 h-6 text-gold" />,
  },
  {
    title: "Study Groups",
    desc: "Real-time groups by subject and year",
    icon: <Users className="w-6 h-6 text-gold" />,
  },
];

export default function FeaturesGrid() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading text-navy font-bold mb-4">Our Features</h2>
          <p className="text-navy/60 font-body max-w-2xl mx-auto">
            Explore the powerful tools designed specifically for the students of Takshashila University.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((tile, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-xl border-t-4 border-maroon shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm group-hover:bg-gold/10 transition-colors">
                  {tile.icon}
                </div>
                <div>
                  <h3 className="text-xl font-heading text-navy font-bold mb-2 group-hover:text-maroon transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-navy/60 font-body text-sm leading-relaxed">
                    {tile.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
