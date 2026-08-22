import { Layers, Brain, Wrench, type LucideIcon } from "lucide-react";
import { LEARNING_PILLARS, LEARNING_QUOTE } from "@/src/lib/data";

const ICONS: Record<string, LucideIcon> = { Layers, Brain, Wrench };

export function FirstPrinciplesSection() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* <p className="font-mono text-xs text-muted-foreground">04 · how we teach</p> */}
          <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            We promise you&apos;ll think like an engineer. That&apos;s what actually gets you hired.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Anyone offering a guaranteed job is selling you something else.
            What we can guarantee is the depth of what you learn — and that
            compounds long after any one interview does.
          </p>
        </div>

        <blockquote className="mt-10 max-w-2xl border-l-2 border-brand pl-6">
          <p className="text-xl font-medium italic leading-snug text-foreground">
            &ldquo;{LEARNING_QUOTE.text}&rdquo;
          </p>
          <cite className="mt-2 block font-mono text-xs not-italic text-muted-foreground">
            — {LEARNING_QUOTE.author}
          </cite>
        </blockquote>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {LEARNING_PILLARS.map((pillar) => {
            const Icon = ICONS[pillar.iconName] ?? Layers;
            return (
              <div key={pillar.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-soft bg-brand-soft text-brand">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-4 text-base font-medium">{pillar.title}</h3>
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