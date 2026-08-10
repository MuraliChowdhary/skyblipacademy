import React from 'react';
import { CheckCircle, ShieldCheck, Sparkles, Globe } from 'lucide-react';

export const WhySkyBlipSection = () => {
  const highlights = [
    {
      icon: Sparkles,
      title: 'AI-Enhanced Curriculum',
      description: 'Learn modern software development using AI tools to boost developer productivity.',
    },
    {
      icon: ShieldCheck,
      title: 'Certified Industry Credentials',
      description: 'Earn certificates recognized across top software enterprises and tech startups.',
    },
    {
      icon: Globe,
      title: 'Flexible Online Learning',
      description: 'Interactive live classes backed by flexible self-paced practice modules.',
    },
    {
      icon: CheckCircle,
      title: 'Dedicated Placement Cell',
      description: 'Direct access to hiring managers, interview practice, and active job openings.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
            Why Choose Sky Blip Academy?
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            We bridge the gap between academic theory and high-demand corporate expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-start"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};