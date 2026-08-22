import { Check, Minus, X } from "lucide-react";
import { COMPARISON_ROWS, type ComparisonRow } from "@/src/lib/data";
import { cn } from "@/src/lib/utils";

function StatusIcon({ status }: { status: ComparisonRow["freeContent"] }) {
  if (status === "yes")
    return <Check className="mx-auto h-4 w-4 text-foreground" strokeWidth={2.5} />;
  if (status === "no")
    return <X className="mx-auto h-4 w-4 text-muted-foreground/50" strokeWidth={2.5} />;
  return <Minus className="mx-auto h-4 w-4 text-muted-foreground/50" strokeWidth={2.5} />;
}

export function ComparisonSection() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto w-full max-w-4xl px-6 lg:px-8">
        {/* <p className="font-mono text-xs text-muted-foreground">03 · how it compares</p> */}
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
          How Sky Blip compares
        </h2>
        <p className="mt-4 max-w-lg text-muted-foreground">
          By category, not by naming platforms we haven&apos;t audited —
          &quot;partial&quot; means it depends on which specific program you pick.
        </p>

        <div className="mt-10 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] bg-secondary/50 text-sm font-medium">
            <div className="px-5 py-4">Feature</div>
            <div className="px-3 py-4 text-center text-muted-foreground">Free content</div>
            <div className="px-3 py-4 text-center text-muted-foreground">Typical bootcamp</div>
            <div className="px-3 py-4 text-center">Sky Blip</div>
          </div>

          {COMPARISON_ROWS.map((row, i) => (
            <div
              key={row.feature}
              className={cn(
                "grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center border-t border-border text-sm",
                i % 2 === 1 && "bg-secondary/20",
              )}
            >
              <div className="px-5 py-4 text-foreground">{row.feature}</div>
              <div className="px-3 py-4"><StatusIcon status={row.freeContent} /></div>
              <div className="px-3 py-4"><StatusIcon status={row.typicalBootcamp} /></div>
              <div className="px-3 py-4 font-medium"><StatusIcon status={row.skyBlip} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
