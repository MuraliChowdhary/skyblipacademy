import { HeroSection } from "@/components/sections/hero-section";
import { OutcomesStrip } from "@/components/sections/outcomes-strip";
import { WhySkyBlipSection } from "@/components/sections/why-skyblip-section";
import { ProgramsSection } from "@/components/sections/programs-section";
import { FoundationSection } from "@/components/sections/foundation-section";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { ComparisonSection } from "@/components/sections/comparision-section";
import { FirstPrinciplesSection } from "@/components/sections/first-principles";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* <OutcomesStrip /> */}
      <WhySkyBlipSection />
      <ProgramsSection />
      <ComparisonSection/>
      <FirstPrinciplesSection />
      <FoundationSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
