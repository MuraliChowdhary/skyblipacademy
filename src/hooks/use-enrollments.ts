import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api-client";

export type Enrollment = {
  id: string;
  courseId: string;
  createdAt: string;
  course: { title: string; slug: string };
};

export function useEnrollments() {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: () => apiClient.get<Enrollment[]>("/api/me/enrollments"),
  });
}
