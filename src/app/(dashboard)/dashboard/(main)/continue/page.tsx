// src/app/(dashboard)/continue/page.tsx
import { redirect } from "next/navigation";
import { requireUser } from "@/src/lib/require-user";
import { getUserCourses } from "@/src/backend/services/course-progress.service";

export default async function ContinuePage() {
  const userId = await requireUser();
  const courses = await getUserCourses(userId);
  const target = courses.find((c) => c.lastAccessedLessonId)?.lastAccessedLessonId;
  redirect(target ? `/dashboard/lessons/${target}` : "/dashboard/my-learning");
}