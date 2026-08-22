import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Program } from "@/lib/data";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Card className="flex flex-col justify-between border-border transition-colors hover:border-foreground/30">
      <CardHeader>
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>{program.duration}</span>
          <span>{program.mode}</span>
        </div>
        <CardTitle className="mt-3 text-lg font-medium leading-snug">
          {program.name}
        </CardTitle>
        <CardDescription className="mt-1 leading-relaxed">
          {program.tagline}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {program.stack.map((s) => (
            <Badge key={s} variant="secondary" className="font-normal">
              {s}
            </Badge>
          ))}
        </div>
        <Separator className="my-5" />
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground">{program.level}</span> · {program.outcome}
        </p>
      </CardContent>

      <CardFooter>
        <Link
          href={`/programs/${program.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View curriculum
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}