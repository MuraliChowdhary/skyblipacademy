import React from 'react';
import Link from 'next/link';
import {
  Rocket,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Rocket className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Sky Blip
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Transforming aspiring tech enthusiasts into industry-ready software engineers through AI-integrated curricula and real-world project training.
            </p>
            <div className="flex space-x-3 pt-2">
              {/* <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                aria-label="Linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="w-4 h-4" />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-white transition-colors">
                  All Programs
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-white transition-colors">
                  Why Sky Blip
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Featured Programs
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/programs" className="hover:text-white transition-colors">
                  MERN Fullstack With AI
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-white transition-colors">
                  Cyber Security (Ethical Hacking)
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-white transition-colors">
                  Python Fullstack With AI
                </Link>
              </li>
              <li>
                <Link href="/placements" className="hover:text-white transition-colors">
                  10-Step Placement Track
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>Tech Hub Boulevard, Innovation District, City Hub</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>+1 (800) 555-SKYBLIP</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>admissions@skyblip.academy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 text-xs text-center text-slate-500">
          <p>© {new Date().getFullYear()} Sky Blip Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};