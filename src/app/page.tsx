import { HeroSection } from "@/src/components/sections/hero-section";
import { WhySkyBlipSection } from "@/src/components/sections/why-skyblip-section";
import { ProgramsSection } from "@/src/components/sections/programs-section";
import { FoundationSection } from "@/src/components/sections/foundation-section";
import { FAQSection } from "@/src/components/sections/faq-section";
import { CTASection } from "@/src/components/sections/cta-section";
import { ComparisonSection } from "@/src/components/sections/comparision-section";
import { FirstPrinciplesSection } from "@/src/components/sections/first-principles";
import { SiteHeader } from "../components/layout/site-header";
import { SiteFooter } from "../components/layout/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader/>
      <HeroSection />
      {/* <OutcomesStrip /> */}
      <WhySkyBlipSection />
      <ProgramsSection />
      <ComparisonSection />
      <FirstPrinciplesSection />
      <FoundationSection />
      <FAQSection />
      <CTASection />
      <SiteFooter/>
    </>
  );
}
