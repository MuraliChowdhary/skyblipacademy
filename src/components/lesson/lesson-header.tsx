// src/components/lesson/lesson-header.tsx
"use client";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { updateLessonProgress, type LessonDetail } from "@/src/lib/api/lessons";
import { useState } from "react";

export function LessonHeader({ lesson }: { lesson: LessonDetail }) {
  const [status, setStatus] = useState(lesson.progress?.status ?? "NOT_STARTED");
  const [pending, setPending] = useState(false);

  const markComplete = async () => {
    setPending(true);
    await updateLessonProgress(lesson.id, { status: "COMPLETED" });
    setStatus("COMPLETED");
    setPending(false);
  };

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">{lesson.title}</h1>
        <Badge variant={status === "COMPLETED" ? "default" : "outline"}>
          {status === "COMPLETED" ? "Completed" : status === "IN_PROGRESS" ? "In progress" : "Not started"}
        </Badge>
      </div>
      <Button size="sm" variant={status === "COMPLETED" ? "secondary" : "default"} disabled={pending || status === "COMPLETED"} onClick={markComplete}>
        <CheckCircle2 className="mr-1.5 h-4 w-4" />
        {status === "COMPLETED" ? "Marked complete" : "Mark complete"}
      </Button>
    </div>
  );
}