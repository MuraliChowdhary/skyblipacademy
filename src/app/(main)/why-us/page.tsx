import { FoundationSection } from "@/src/components/sections/foundation-section";
import { WhySkyBlipSection } from "@/src/components/sections/why-skyblip-section";


export const metadata = {
  title: 'Why Sky Blip | Sky Blip Academy',
};

export default function WhyUsPage() {
  return (
    <div>
      <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Why Choose Sky Blip?
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Empowering students through cutting-edge technology training and dedicated mentorship.
          </p>
        </div>
      </section>

      <WhySkyBlipSection />
      <FoundationSection />
    </div>
  );
}