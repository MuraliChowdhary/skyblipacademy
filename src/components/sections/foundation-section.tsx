import { BookOpen, MonitorPlay, Users, Award, type LucideIcon } from "lucide-react";
import { FOUNDATION_PILLARS } from "@/src/lib/data";

const ICONS: Record<string, LucideIcon> = { BookOpen, MonitorPlay, Users, Award };

export function FoundationSection() {
  return (
    <section className="border-b border-border bg-secondary/40 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="max-w-xl">
          {/* <p className="font-mono text-xs text-muted-foreground">05 · how it&apos;s taught</p> */}
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            What holds the program together
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {FOUNDATION_PILLARS.map((pillar) => {
            const Icon = ICONS[pillar.iconName] ?? BookOpen;
            return (
              <div key={pillar.title} className="bg-background p-7">
                <Icon className="h-5 w-5 text-foreground" strokeWidth={1.75} />
                <h3 className="mt-5 text-base font-medium">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
