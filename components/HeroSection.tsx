import React from 'react';
import Link from 'next/link';
import { ChevronRight, Award, Users, BookOpen } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28 border-b border-slate-800">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>Next-Gen Tech Education</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Master Tech Skills with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-teal-300 bg-clip-text text-transparent">
              AI-Powered Learning
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Accelerate your career with industry-vetted fullstack and cybersecurity programs. Gain practical experience with real-time live projects and guaranteed placement training.
          </p>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/programs"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center justify-center"
            >
              Explore Programs
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center"
            >
              Book Free Counseling
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-12 grid grid-cols-3 gap-4 border-t border-slate-800/80">
            <div className="text-center">
              <div className="flex justify-center mb-1 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white">3,600+</div>
              <div className="text-xs text-slate-400">Enrolled Students</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1 text-indigo-400">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-400">Placement Support</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1 text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white">10 Steps</div>
              <div className="text-xs text-slate-400">Career Roadmap</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};