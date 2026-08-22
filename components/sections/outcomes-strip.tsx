import { PROGRAM_FACTS } from "@/lib/data";

export function OutcomesStrip() {
  return (
    <section className="border-b border-border bg-secondary/50">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 divide-x divide-border px-6 py-10 lg:px-8 sm:grid-cols-3">
        {PROGRAM_FACTS.map((item) => (
          <div key={item.label} className="px-4 text-center first:pl-0 sm:px-6">
            <p className="font-mono text-2xl font-medium text-foreground sm:text-3xl">
              {item.value}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
