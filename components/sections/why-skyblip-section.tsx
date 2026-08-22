import { Sparkles, ShieldCheck, Globe, CheckCircle, type LucideIcon } from "lucide-react";
import { WHY_SKYBLIP } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = { Sparkles, ShieldCheck, Globe, CheckCircle };

export function WhySkyBlipSection() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            {/* <p className="font-mono text-xs text-muted-foreground">01 · why sky blip</p> */}
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              Why Sky Blip
            </h2>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Four things we can actually back up on day one — not the full
              list of what we hope to become.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {WHY_SKYBLIP.map((item) => {
              const Icon = ICONS[item.iconName] ?? CheckCircle;
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-soft bg-brand-soft text-brand">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}