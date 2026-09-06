// src/components/lesson/lesson-breadcrumb.tsx
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";

interface Trail {
  course: { id: string; title: string };
  module: { id: string; title: string };
  parentLesson: { id: string; title: string } | null;
  lesson: { id: string; title: string };
}

export function LessonBreadcrumb({ trail }: { trail: Trail }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/dashboard/my-learning">My Courses</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href={`/dashboard/courses/${trail.course.id}`}>{trail.course.title}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span className="text-muted-foreground">{trail.module.title}</span>
        </BreadcrumbItem>
        {trail.parentLesson && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={`/dashboard/lessons/${trail.parentLesson.id}`}>{trail.parentLesson.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{trail.lesson.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}