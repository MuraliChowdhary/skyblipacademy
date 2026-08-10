import { HeroSection } from '@/components/HeroSection';
import { ProgramsSection } from '@/components/ProgramsSection';
import { FoundationSection } from '@/components/FoundationSection';
import { WhySkyBlipSection } from '@/components/WhySkyBlipSection';
import { PlacementProcess } from '@/components/PlacementProcess';
import { FAQSection } from '@/components/FAQSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProgramsSection />
      <FoundationSection />
      <PlacementProcess />
      <WhySkyBlipSection />
      <FAQSection />
    </>
  );
}