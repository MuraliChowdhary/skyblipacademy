// src/hooks/use-user-courses.ts
import { useQuery } from "@tanstack/react-query";

export interface UserCourse {
  courseId: string;
  title: string;
  slug: string;
  totalLessons: number;
  completedLessons: number;
  lastAccessedLessonId: string | null;
}

async function fetchUserCourses(): Promise<UserCourse[]> {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/me/courses`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

export function useUserCourses() {
  return useQuery({ queryKey: ["me", "courses"], queryFn: fetchUserCourses });
}