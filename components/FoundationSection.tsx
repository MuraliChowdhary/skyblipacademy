import React from 'react';
import { BookOpen, MonitorPlay, Users, Award } from 'lucide-react';

export const FoundationSection = () => {
  const pillars = [
    {
      icon: BookOpen,
      title: 'Structured Curriculum',
      description: 'Step-by-step learning modules built from foundation to advanced hands-on applications.',
    },
    {
      icon: MonitorPlay,
      title: 'Real-World Projects',
      description: 'Build enterprise-grade applications solving real domain challenges.',
    },
    {
      icon: Users,
      title: '1-on-1 Expert Mentorship',
      description: 'Direct guidance from senior industry engineers and technical leaders.',
    },
    {
      icon: Award,
      title: 'Career Readiness',
      description: 'Comprehensive placement training, mock interviews, and recruiter referrals.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">
            Core Learning Blueprint
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight mt-2">
            The Foundation Of Every Sky Blip Success Story
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Your Journey From Learning To Landing A Tech Role, We Guide You At Every Step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-5 shadow-md shadow-indigo-600/20">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};