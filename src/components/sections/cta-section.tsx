import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { PRIMARY_CTA } from "@/src/lib/data";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-secondary/40 px-8 py-16 text-center sm:px-16">
          <p className="font-mono text-xs text-muted-foreground">
            next cohort · 12 days out
          </p>
          <h2 className="mx-auto mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
            Fifteen minutes to know if this is the right track for you.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            No forms to fill out twice. Book a call, talk to an advisor, and
            walk away with a clear next step either way.
          </p>
          <Button size="lg" className="mt-8">
            <Link href="/contact" className="flex">
              {PRIMARY_CTA}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
