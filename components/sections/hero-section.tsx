import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignalOrbit } from "@/components/sections/signal-orbit";
import { RotatingWord } from "@/components/sections/rotating-word";

export function HeroSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div>
          {/* <p className="font-mono text-xs text-muted-foreground">
            &gt; career_track / fullstack.ai
          </p> */}

          <h1 className="mt-5 max-w-xl text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl">
            Where ambition and skill
            <RotatingWord />
            together.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Achieve your ambitions with industry-ready skills and real-world experience through practical knowledge projects and mentorship in every program. We&apos;re committed to helping you excel.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button  size="lg">
              <Link href="/programs" className="flex">
                Explore Programs
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/cohort" className="flex">
                <PlayCircle className="mr-1.5 h-4 w-4" />
                Attend Live Demo
              </Link>
            </Button>
          </div>

          <p className="mt-8 font-mono text-xs text-muted-foreground">
            no spam · 15-minute call · founding cohort forming now
          </p>
        </div>

        <SignalOrbit />
      </div>
    </section>
  );
}