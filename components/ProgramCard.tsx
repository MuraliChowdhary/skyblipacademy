import React from 'react';
import Link from 'next/link';
import { Star, Clock, Laptop, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { Program } from '@/types';

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-indigo-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-indigo-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-indigo-600" />;
      default:
        return <Laptop className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 hover:-translate-y-1">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
            {getIcon(program.iconName)}
          </div>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{program.rating}</span>
            <span className="text-slate-400">({program.reviews})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {program.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {program.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center text-xs font-medium text-slate-500">
          <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
          <span>{program.duration}</span>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Enroll Now
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};