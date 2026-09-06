// src/components/lesson/video-panel.tsx
import { Badge } from "@/src/components/ui/badge";
import { Clock } from "lucide-react";
import type { LessonDetail } from "@/src/lib/api/lessons";

export function VideoPanel({ lesson }: { lesson: LessonDetail }) {
  if (lesson.videoStatus === "PUBLISHED" && lesson.videoUrl) {
    return (
      <div className="aspect-video overflow-hidden rounded-lg border bg-black">
        <video
          src={lesson.videoUrl}
          controls
          className="h-full w-full"
          defaultValue={lesson.progress?.videoPositionSeconds ?? 0}
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/30 text-center">
      <Clock className="h-6 w-6 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium">Recording is being edited</p>
        <p className="text-sm text-muted-foreground">
          The notes and assignment below are ready — you don&apos;t need the video to start.
        </p>
      </div>
      <Badge variant="secondary">Video pending</Badge>
    </div>
  );
}