"use client";

import { Badge } from "@/src/components/ui/badge";
import { Clock } from "lucide-react";
import type { LessonDetail } from "@/src/lib/api/lessons";

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    // https://youtu.be/30JW4N9slfc
    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // https://www.youtube.com/watch?v=30JW4N9slfc
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function VideoPanel({ lesson }: { lesson: LessonDetail }) {
  if (lesson.videoStatus === "PUBLISHED" && lesson.videoUrl) {
    const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl);

    if (!embedUrl) {
      return (
        <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted">
          Invalid YouTube URL
        </div>
      );
    }

    return (
      <div className="aspect-video overflow-hidden rounded-lg border bg-black">
        <iframe
          src={embedUrl}
          title={lesson.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/30 text-center">
      <Clock className="h-6 w-6 text-muted-foreground" />

      <div className="space-y-1">
        <p className="text-sm font-medium">
          Recording is being edited
        </p>

        <p className="text-sm text-muted-foreground">
          The notes and assignment below are ready — you don&apos;t need the
          video to start.
        </p>
      </div>

      <Badge variant="secondary">Video pending</Badge>
    </div>
  );
}