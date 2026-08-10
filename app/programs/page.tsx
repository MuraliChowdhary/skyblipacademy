import { ProgramsSection } from '@/components/ProgramsSection';
import { FoundationSection } from '@/components/FoundationSection';
import Link from 'next/link';

export const metadata = {
  title: 'Programs | Sky Blip Academy',
};

export default function ProgramsPage() {
  return (
    <div>
      <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Explore All Programs
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Practical hands-on bootcamps engineered to build real engineering expertise.
          </p>
        </div>
      </section>

      <ProgramsSection />
      <FoundationSection />

      <section className="py-16 bg-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-indigo-100 mb-8">
            Speak with an academic advisor today to find the right track for your career goals.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-colors"
          >
            Get Free Counseling
          </Link>
        </div>
      </section>
    </div>
  );
}