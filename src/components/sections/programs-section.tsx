import { PROGRAMS } from "@/src/lib/data";
import { ProgramCard } from "@/src/components/sections/program-card";

export function ProgramsSection() {
  return (
    <section id="programs" className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="max-w-xl">
          {/* <p className="font-mono text-xs text-muted-foreground">02 · programs</p> */}
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            Three tracks. One placement standard.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every track ends the same way: shipped projects, mock interviews,
            and a warm hand-off into our hiring-partner pipeline.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROGRAMS.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </div>
    </section>
  );
}
