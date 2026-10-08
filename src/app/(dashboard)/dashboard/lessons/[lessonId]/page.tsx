// src/app/(dashboard)/lessons/[lessonId]/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { LessonHeader } from "@/src/components/lesson/lesson-header";
import { VideoPanel } from "@/src/components/lesson/video-panel";
import { ContentPanel } from "@/src/components/lesson/content-panel";
import { WrapUpPanel } from "@/src/components/lesson/wrapup-panel";
import { AssignmentPanel } from "@/src/components/lesson/assignment-panel";
import { OverviewPanel } from "@/src/components/lesson/overview-panel";
import { getLessonBreadcrumb, getLessonDetail } from "@/src/backend/services/course-progress.service";
import { getLessonAssignment } from "@/src/backend/services/assignment.service";
import { requireUser } from "@/src/lib/require-user";
import { AppError } from "@/src/lib/app-error";
// import { LessonBreadcrumb } from "@/src/components/lesson/lesson-breadcrumb";
import { SetBreadcrumb } from "@/src/components/dashboard/set-breadcrumb";
import { LessonTopbar } from "@/src/components/lesson/lesson-topbar";
import { getLessonNav } from "@/src/backend/services/lesson-nav.service";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const userId = await requireUser();

  let lesson;
  try {
    lesson = await getLessonDetail(userId, lessonId);
  } catch (err) {
    const notFoundOrForbidden = err instanceof AppError && (err.status === 404 || err.status === 403);
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="rounded-lg border p-6">
          <h1 className="text-lg font-semibold">
            {notFoundOrForbidden ? "Lesson not found" : "Something went wrong"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {notFoundOrForbidden
              ? "This lesson doesn't exist or isn't part of a course you've purchased."
              : "Please try again."}
          </p>
        </div>
      </main>
    );
  }
  const trail = await getLessonBreadcrumb(userId, lessonId);

  const nav = await getLessonNav(userId, lessonId);

  const breadcrumbItems = [
  { label: "My Course", href: "/dashboard/my-learning" },
  { label: trail.course.title, href: `/dashboard/courses/${trail.course.id}` },
  { label: trail.module.title, href: `/dashboard/courses/${trail.course.id}`, }, // no href — no module page exists
  ...(trail.parentLesson ? [{ label: trail.parentLesson.title, href: `/dashboard/lessons/${trail.parentLesson.id}` }] : []),
  { label: trail.lesson.title },
];

  // An OVERVIEW lesson is just a topic list — no video/content/assignment
  // tabs of its own, so it gets its own layout instead of the tab set.
  if (lesson.kind === "OVERVIEW") {
    return (
          <>
       <LessonTopbar nav={nav} />
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
    <div className="space-y-6">
      <SetBreadcrumb items={breadcrumbItems} />
      <LessonHeader lesson={lesson} />
      <OverviewPanel
        learningGoals={lesson.learningGoals}
        estimatedMinutes={lesson.estimatedMinutes}
        topics={lesson.topics ?? []}
      />
    </div>
  </main>
  </>
    );
  }

  const assignment = await getLessonAssignment(userId, lessonId);


  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="space-y-6">

        <SetBreadcrumb items={breadcrumbItems} />
        <LessonHeader lesson={lesson} />

        

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="wrapup">Wrap-up</TabsTrigger>
            <TabsTrigger value="extra">Extra</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <ContentPanel contentBody={lesson.contentBody ?? null} notionUrl={lesson.notionUrl} />
          </TabsContent>

          <TabsContent value="video" className="mt-6">
            <VideoPanel lesson={lesson} />
          </TabsContent>

          <TabsContent value="assignment" className="mt-6">
            <AssignmentPanel assignment={assignment} />
          </TabsContent>

          <TabsContent value="wrapup" className="mt-6">
            <WrapUpPanel wrapUp={lesson.wrapUp} />
          </TabsContent>

          <TabsContent value="extra" className="mt-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">Extra Resources</h2>
              <p className="mt-2 text-sm text-muted-foreground">No extra resources yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}