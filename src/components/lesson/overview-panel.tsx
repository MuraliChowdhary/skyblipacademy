// src/components/lesson/overview-panel.tsx
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Progress } from "@/src/components/ui/progress";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  slug: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

const statusIcon = {
  NOT_STARTED: Circle,
  IN_PROGRESS: PlayCircle,
  COMPLETED: CheckCircle2,
};

export function OverviewPanel({
  learningGoals,
  estimatedMinutes,
  topics,
}: {
  learningGoals: string[];
  estimatedMinutes: number | null;
  topics: Topic[];
}) {
  const completed = topics.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">What you&apos;ll learn</h2>
          {estimatedMinutes && (
            <span className="text-sm text-muted-foreground">{estimatedMinutes} min</span>
          )}
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {learningGoals.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Topics</h2>
          <span className="text-sm text-muted-foreground">
            {completed} / {topics.length} complete
          </span>
        </div>
        <Progress value={topics.length ? (completed / topics.length) * 100 : 0} />

        <div className="divide-y rounded-lg border">
          {topics.map((topic) => {
            const Icon = statusIcon[topic.status];
            return (
              <Link
                key={topic.id}
                href={`/dashboard/lessons/${topic.id}`}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    topic.status === "COMPLETED" ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span className="flex-1 text-sm font-medium">{topic.title}</span>
                {topic.status === "IN_PROGRESS" && <Badge variant="secondary">In progress</Badge>}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}