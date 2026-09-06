// src/app/(dashboard)/courses/[courseId]/page.tsx
import Link from "next/link";
import { requireUser } from "@/src/lib/require-user";
import { getCoursePreview } from "@/src/backend/services/catalog.service";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { SetBreadcrumb } from "@/src/components/dashboard/set-breadcrumb";
import { PurchaseDialog } from "@/src/components/courses/purchase-dialog";
import Image from "next/image";
export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const userId = await requireUser();
  const { course, isEnrolled } = await getCoursePreview(userId, courseId);

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <SetBreadcrumb items={[{ label: "Browse Courses", href: "/courses" }, { label: course.title }]} />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{course.title}</h1>
            {isEnrolled && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Enrolled</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>

        {isEnrolled ? (
          <Button>
            <Link href={`/dashboard/courses/${course.id}`}>Go to course</Link>
          </Button>
        ) : (
          <PurchaseDialog courseId={course.id} courseTitle={course.title} priceCents={course.priceCents} />
        )}
      </div>

      {course.syllabus && (
        <div className="space-y-2 rounded-lg border p-5">
          <h2 className="text-sm font-semibold">Syllabus</h2>
          <div className="prose prose-neutral prose-sm max-w-none dark:prose-invert">
            {course.syllabus && (
              <div className="mt-4 overflow-hidden rounded-lg border">
                <Image
                  src={course.syllabus}
                  alt={`${course.title} syllabus`}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}