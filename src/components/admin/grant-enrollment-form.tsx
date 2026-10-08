// src/components/admin/grant-enrollment-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

export function GrantEnrollmentForm({ userId, courses }: { userId: string; courses: { id: string; title: string }[] }) {
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const grant = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    setLoading(false);
    if ((await res.json()).success) router.refresh();
  };

  return (
    <div className="flex gap-2">
      <Select value={courseId} onValueChange={(value) => setCourseId(value || "")}>
        <SelectTrigger className="w-64"><SelectValue placeholder="Grant access to..." /></SelectTrigger>
        <SelectContent>
          {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button size="sm" onClick={grant} disabled={!courseId || loading}>Grant</Button>
    </div>
  );
}