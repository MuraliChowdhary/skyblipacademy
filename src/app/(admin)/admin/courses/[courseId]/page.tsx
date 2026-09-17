// src/app/(admin)/admin/courses/[courseId]/page.tsx
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { Badge } from "@/src/components/ui/badge";
import { CoursePublishToggle } from "@/src/components/admin/course-publish-toggle";
import { LessonStatusRow } from "@/src/components/admin/lesson-status-row";
import { AddModuleDialog } from "@/src/components/admin/add-module-dialog";
import { AddLessonDialog } from "@/src/components/admin/add-lesson-dialog";
import { ModuleActionsMenu } from "@/src/components/admin/module-actions-menu";
import { LessonActionsMenu } from "@/src/components/admin/lesson-actions-menu";
import { auth } from "@/src/lib/auth";
import { requireRole } from "@/src/lib/require-session";

export default async function AdminCourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth();
  requireRole(session,"ADMIN");
  const { courseId } = await params;

  const course = await prisma.course.findUniqueOrThrow({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            where: { parentId: null },
            include: {
              children: { orderBy: { order: "asc" } }, // pulls TOPIC rows under an OVERVIEW lesson
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{course.title}</h1>
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <AddModuleDialog courseId={course.id} nextOrder={course.modules.length + 1} />
          <CoursePublishToggle courseId={course.id} isPublished={course.isPublished} />
        </div>
      </div>

      {course.modules.map((module) => (
        <section key={module.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{module.title}</h2>
            <ModuleActionsMenu moduleId={module.id} title={module.title} />
          </div>

          <div className="divide-y rounded-lg border">
            {module.lessons.map((lesson) => (
              <div key={lesson.id}>
                {/* Top-level row — lesson or OVERVIEW parent */}
                <div className="flex items-center">
                  <Link href={`/admin/lessons/${lesson.id}`} className="flex-1 px-4 py-2 text-sm font-medium hover:underline">
                    {lesson.title}
                  </Link>
                  {lesson.kind === "OVERVIEW" && (
                    <Badge variant="outline" className="mr-2">
                      {lesson.children.length} topics
                    </Badge>
                  )}
                  <LessonStatusRow
                    lesson={{
                      id: lesson.id,
                      title: "",
                      kind: lesson.kind,
                      contentStatus: lesson.contentStatus,
                      videoStatus: lesson.videoStatus,
                    }}
                    hideTitle
                  />
                  <LessonActionsMenu lessonId={lesson.id} title={lesson.title} />
                </div>

                {/* Nested topics — this is what was missing */}
                {lesson.children.length > 0 && (
                  <div className="ml-6 divide-y border-t bg-muted/20">
                    {lesson.children.map((topic) => (
                      <div key={topic.id} className="flex items-center">
                        <Link href={`/admin/lessons/${topic.id}`} className="flex-1 px-4 py-2 text-sm hover:underline">
                          ↳ {topic.title}
                        </Link>
                        <LessonStatusRow
                          lesson={{
                            id: topic.id,
                            title: "",
                            kind: topic.kind,
                            contentStatus: topic.contentStatus,
                            videoStatus: topic.videoStatus,
                          }}
                          hideTitle
                        />
                        <LessonActionsMenu lessonId={topic.id} title={topic.title} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Add a topic under this specific OVERVIEW lesson */}
                {lesson.kind === "OVERVIEW" && (
                  <div className="ml-6 border-t pl-4 py-1.5">
                    <AddLessonDialog
                      moduleId={module.id}
                      nextOrder={lesson.children.length + 1}
                      parentId={lesson.id}
                      label="Add topic"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <AddLessonDialog moduleId={module.id} nextOrder={module.lessons.length + 1} />
        </section>
      ))}
    </div>
  );
}