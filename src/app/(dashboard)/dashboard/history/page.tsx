// src/app/(dashboard)/history/page.tsx
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { History as HistoryIcon, CheckCircle2, PlayCircle, Circle } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/dashboard/empty-state";
import { formatDate } from "@/src/lib/format";

interface HistoryEntry {
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  videoPositionSeconds: number;
  lastAccessedAt: string;
}

const statusIcon = { NOT_STARTED: Circle, IN_PROGRESS: PlayCircle, COMPLETED: CheckCircle2 };
const statusLabel = { NOT_STARTED: "Not started", IN_PROGRESS: "In progress", COMPLETED: "Completed" };

async function fetchHistory(): Promise<HistoryEntry[]> {
  const res = await fetch("/api/me/history");
  const json = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

function groupByDay(entries: HistoryEntry[]) {
  const groups = new Map<string, HistoryEntry[]>();
  for (const entry of entries) {
    const day = new Date(entry.lastAccessedAt).toDateString();
    groups.set(day, [...(groups.get(day) ?? []), entry]);
  }
  return groups;
}

export default function HistoryPage() {
  const { data, isLoading } = useQuery({ queryKey: ["me", "history"], queryFn: fetchHistory });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={HistoryIcon}
        title="No activity yet"
        description="Lessons you watch or read will show up here so you can pick up where you left off."
      />
    );
  }

  const groups = groupByDay(data);

  return (
    <div className="space-y-6">
      {[...groups.entries()].map(([day, entries]) => (
        <div key={day} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{formatDate(day)}</h3>
          <div className="divide-y rounded-lg border">
            {entries.map((entry) => {
              const Icon = statusIcon[entry.status];
              return (
                <Link
                  key={entry.lessonId}
                  href={`/dashboard/lessons/${entry.lessonId}`}
                  className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      entry.status === "COMPLETED" ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{entry.lessonTitle}</p>
                    <p className="text-xs text-muted-foreground">{entry.courseTitle}</p>
                  </div>
                  <Badge variant={entry.status === "COMPLETED" ? "default" : "secondary"}>
                    {statusLabel[entry.status]}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}