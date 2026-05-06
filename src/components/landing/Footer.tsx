"use client";

import { GraduationCap, Camera, Briefcase, Code, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy pt-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-maroon p-1.5 rounded-lg">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <h2 className="text-white font-heading text-2xl font-bold">TakshConnect</h2>
            </div>
            <p className="text-white/60 font-body text-sm leading-relaxed mb-8">
              Built exclusively for Takshashila University students. Your all-in-one companion for academics, careers, and community.
            </p>
            <div className="flex gap-4">
              {[Camera, Briefcase, Code].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-navy-card border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-heading text-xl font-bold mb-8">Quick Links</h3>
            <ul className="space-y-4">
              {["Home", "Notes", "Internships", "Events", "CGPA", "AI Tutor", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 font-body text-sm hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-maroon rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Resources */}
          <div>
            <h3 className="text-gold font-heading text-xl font-bold mb-8">Resources</h3>
            <ul className="space-y-4">
              {["Library Access", "Student Handbook", "Exam Schedule", "Placement Portal", "Campus Map"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 font-body text-sm hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-maroon rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold font-heading text-xl font-bold mb-8">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin className="w-5 h-5 text-maroon shrink-0" />
                <span className="text-white/60 font-body text-sm leading-relaxed">
                  Ongur, Tindivanam Taluk, Villupuram District, Tamil Nadu – 604 305
                </span>
              </li>
              <li className="flex gap-4">
                <Phone className="w-5 h-5 text-maroon shrink-0" />
                <span className="text-white/60 font-body text-sm">
                  +91 12345 67890
                </span>
              </li>
              <li className="flex gap-4">
                <Mail className="w-5 h-5 text-maroon shrink-0" />
                <span className="text-white/60 font-body text-sm">
                  contact@takshashilauniv.ac.in
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 font-body text-xs text-center">
            © 2026 TakshConnect. Built by Goutham Gagan for Takshashila University students.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-white/40 font-body text-xs hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/40 font-body text-xs hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
