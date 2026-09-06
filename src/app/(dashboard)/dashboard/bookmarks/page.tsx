// src/app/(dashboard)/bookmarks/page.tsx
"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark as BookmarkIcon, PlayCircle, FileText, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/dashboard/empty-state";

interface BookmarkEntry {
  id: string;
  type: "VIDEO_TIMESTAMP" | "CONTENT_SECTION";
  videoTimestampSeconds: number | null;
  sectionAnchor: string | null;
  note: string | null;
  createdAt: string;
  lesson: { id: string; title: string };
  course: { id: string; title: string };
}

function formatTimestamp(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

async function fetchBookmarks(): Promise<BookmarkEntry[]> {
  const res = await fetch("/api/me/bookmarks");
  const json = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

export default function BookmarksPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["me", "bookmarks"], queryFn: fetchBookmarks });

  const remove = async (id: string) => {
    await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
    queryClient.setQueryData<BookmarkEntry[]>(["me", "bookmarks"], (prev) =>
      prev?.filter((b) => b.id !== id)
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={BookmarkIcon}
        title="No bookmarks yet"
        description="Save a video moment or a section of notes while learning, and it'll show up here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {data.map((b) => {
        const Icon = b.type === "VIDEO_TIMESTAMP" ? PlayCircle : FileText;
        return (
          <Card key={b.id}>
            <CardContent className="flex items-start gap-3 py-4">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/lessons/${b.lesson.id}`} className="text-sm font-medium hover:underline">
                    {b.lesson.title}
                  </Link>
                  {b.type === "VIDEO_TIMESTAMP" && b.videoTimestampSeconds != null && (
                    <Badge variant="outline">{formatTimestamp(b.videoTimestampSeconds)}</Badge>
                  )}
                  {b.type === "CONTENT_SECTION" && b.sectionAnchor && (
                    <Badge variant="outline">{b.sectionAnchor}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{b.course.title}</p>
                {b.note && <p className="text-sm text-muted-foreground">{b.note}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(b.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}