// src/app/(dashboard)/my-learning/page.tsx
"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Progress } from "@/src/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/dashboard/empty-state";
import { useUserCourses } from "@/src/hooks/use-user-courses";

export default function MyLearningPage() {
  const { data, isLoading } = useUserCourses();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No courses yet"
        description="Once you enroll in a program, it shows up here with everything you need to keep going."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((course) => {
        const pct = course.totalLessons
          ? Math.round((course.completedLessons / course.totalLessons) * 100)
          : 0;

        return (
          <Link key={course.courseId} href={`/dashboard/courses/${course.courseId}`}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardHeader>
                <CardTitle className="text-base">{course.title}</CardTitle>
                <CardDescription>
                  {course.completedLessons} of {course.totalLessons} lessons complete
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress value={pct} />
                <p className="text-xs text-muted-foreground">{pct}% complete</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}