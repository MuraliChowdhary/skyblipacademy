// src/app/(dashboard)/courses/[courseId]/page.tsx
import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { getCourseDetail } from "@/src/backend/services/course-progress.service";
import { requireUser } from "@/src/lib/require-user";
import { AppError } from "@/src/lib/app-error";

const statusIcon = {
  NOT_STARTED: Circle,
  IN_PROGRESS: PlayCircle,
  COMPLETED: CheckCircle2,
};

export default async function CourseSyllabusPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

const userId = await requireUser();

let modules;

try {
  
  modules = await getCourseDetail(userId, courseId);
  } catch (err) {
    const forbidden = err instanceof AppError && err.status === 403;
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="rounded-lg border p-6">
          <h1 className="text-lg font-semibold">
            {forbidden ? "You don't have access to this course" : "Course not found"}
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
      {modules.map((module) => (
        <section key={module.id} className="space-y-3">
          <h2 className="text-lg font-semibold">{module.title}</h2>
          <div className="divide-y rounded-lg border">
            {module.lessons.map((lesson) => {
              const status = lesson.progress[0]?.status ?? "NOT_STARTED";
              const Icon = statusIcon[status as keyof typeof statusIcon];
              const hasChildren = lesson._count.children > 0;

              return (
                <Link
                  key={lesson.id}
                  href={`/dashboard/lessons/${lesson.id}`}
                  className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      status === "COMPLETED" ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="flex-1 text-sm font-medium">{lesson.title}</span>
                  {hasChildren && <Badge variant="outline">{lesson._count.children} topics</Badge>}
                  {status === "IN_PROGRESS" && <Badge variant="secondary">In progress</Badge>}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}