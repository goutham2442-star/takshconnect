"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ApplyButton() {
  return (
    <div className="fixed bottom-6 left-6 z-50 md:hidden">
      <motion.a
        href="https://takshashilauniv.ac.in/admission-registration-2026/"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-gold text-navy font-bold px-6 py-4 rounded-full shadow-xl shadow-gold/20"
      >
        Apply Now
        <ArrowRight className="w-4 h-4" />
      </motion.a>
    </div>
  );
}
