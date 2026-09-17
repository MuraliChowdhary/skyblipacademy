// src/components/admin/course-publish-toggle.tsx
"use client";

import { useState } from "react";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";

export function CoursePublishToggle({ courseId, isPublished }: { courseId: string; isPublished: boolean }) {
  const [published, setPublished] = useState(isPublished);
  const [loading, setLoading] = useState(false);

  const toggle = async (checked: boolean) => {
    setLoading(true);
    const res = await fetch(`/api/admin/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: checked }),
    });
    if ((await res.json()).success) setPublished(checked);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="published" className="text-sm">Published</Label>
      <Switch id="published" checked={published} disabled={loading} onCheckedChange={toggle} />
    </div>
  );
}