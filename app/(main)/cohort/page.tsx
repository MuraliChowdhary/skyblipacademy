export default function CohortPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-24 lg:px-8">
      <p className="font-mono text-xs text-muted-foreground">cohort</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
        Founding cohort — forming now
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Full cohort schedule, batch dates, and live demo booking go here.
        This page is scoped for the next build pass, once NextAuth and the
        booking flow are wired in.
      </p>
    </section>
  );
}
