"use client";

import { GraduationCap } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/dashboard/empty-state";
import { useEnrollments } from "@/src/hooks/use-enrollments";
import { formatDate } from "@/src/lib/format";

export default function MyLearningPage() {
  const { data, isLoading } = useEnrollments();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-32" />
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
      {data.map((enrollment) => (
        <Card key={enrollment.id}>
          <CardHeader>
            <CardTitle className="text-base">{enrollment.course.title}</CardTitle>
            <CardDescription>Enrolled {formatDate(enrollment.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Progress tracking arrives in the next release — for now, this
              confirms you have full access to the material.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
