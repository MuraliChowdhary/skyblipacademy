import React from 'react';
import { PROGRAMS } from '@/lib/data';
import { ProgramCard } from './ProgramCard';

export const ProgramsSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            Our Premium Programs
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Master the skills of the future. Industry-vetted curriculum designed to make you a highly sought-after professional. Learn practically with real-world projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </div>
    </section>
  );
};