// src/components/admin/lesson-status-row.tsx
"use client";

import { useState } from "react";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface Lesson {
  id: string;
  title: string;
  kind: "STANDALONE" | "OVERVIEW" | "TOPIC";
  contentStatus: "DRAFT" | "PUBLISHED";
  videoStatus: "NOT_RECORDED" | "EDITING" | "PUBLISHED";
}

async function patchLesson(
  id: string,
  body: Record<string, string>
): Promise<boolean> {
  const res = await fetch(`/api/admin/lessons/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) return false;

  const data = await res.json();
  return data.success;
}

export function LessonStatusRow({
  lesson,
  hideTitle = false,
}: {
  lesson: Lesson;
  hideTitle?: boolean;
}) {
  const [contentStatus, setContentStatus] = useState(lesson.contentStatus);
  const [videoStatus, setVideoStatus] = useState(lesson.videoStatus);

  return (
    <div className="flex items-center gap-4 p-4">
      {!hideTitle && (
        <span className="flex-1 text-sm font-medium">
          {lesson.title}
        </span>
      )}

      {lesson.kind !== "OVERVIEW" && (
        <Badge variant="outline">
          {lesson.kind === "TOPIC" ? "Topic" : "Lesson"}
        </Badge>
      )}

      <Select
        value={contentStatus}
        onValueChange={async (v) => {
          if (!v) return;

          const status = v as "DRAFT" | "PUBLISHED";

          if (
            await patchLesson(lesson.id, {
              contentStatus: status,
            })
          ) {
            setContentStatus(status);
          }
        }}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="DRAFT">Content: Draft</SelectItem>
          <SelectItem value="PUBLISHED">Content: Live</SelectItem>
        </SelectContent>
      </Select>

      {lesson.kind !== "OVERVIEW" && (
        <Select
          value={videoStatus}
          onValueChange={async (v) => {
            if (!v) return;

            const status = v as
              | "NOT_RECORDED"
              | "EDITING"
              | "PUBLISHED";

            if (
              await patchLesson(lesson.id, {
                videoStatus: status,
              })
            ) {
              setVideoStatus(status);
            }
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="NOT_RECORDED">
              Video: Not recorded
            </SelectItem>
            <SelectItem value="EDITING">
              Video: Editing
            </SelectItem>
            <SelectItem value="PUBLISHED">
              Video: Live
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}