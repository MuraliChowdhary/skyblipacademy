'use client';

import React, { useState } from 'react';
import { PLACEMENT_STEPS } from '@/lib/data';
import {
  FileText,
  Users,
  MessageSquare,
  Briefcase,
  MonitorPlay,
  BookOpen,
  UserCheck,
  CheckCircle,
  Award,
} from 'lucide-react';

export const PlacementProcess = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'MonitorPlay':
        return <MonitorPlay className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5" />;
      case 'CheckCircle':
        return <CheckCircle className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const selectedStepData = PLACEMENT_STEPS.find((s) => s.id === activeStep) || PLACEMENT_STEPS[0];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">
            Structured Career Track
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight mt-2">
            Our 10-Step Placement Journey
          </h2>
          <p className="mt-3 text-slate-600">
            A step-by-step career acceleration program designed to take you from initial learning to getting hired.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Steps selector sidebar */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {PLACEMENT_STEPS.map((step) => {
              const isSelected = step.id === activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 font-bold text-xs ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span className="font-semibold text-sm truncate">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active step display details */}
          <div className="lg:col-span-7 bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-xl min-h-[360px] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
                <span>Step {selectedStepData.id} of 10</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                  {getStepIcon(selectedStepData.iconName)}
                </div>
                <h3 className="text-2xl font-bold">{selectedStepData.title}</h3>
              </div>
              <p className="text-slate-300 text-base leading-relaxed mt-4">
                {selectedStepData.desc}
              </p>
            </div>

            <div className="pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Sky Blip Career Accelerator</span>
              <span>100% Placement Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};