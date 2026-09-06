import Link from "next/link";

import { requireUser } from "@/src/lib/require-user";
import { getCourseCatalog } from "@/src/backend/services/catalog.service";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { SetBreadcrumb } from "@/src/components/dashboard/set-breadcrumb";
import Image from "next/image";

export default async function CourseCatalogPage() {
  const userId = await requireUser();
  const courses = await getCourseCatalog(userId);

  return (
    <div className="w-full space-y-8 px-6 py-8">
      <SetBreadcrumb
        items={[
          {
            label: "Browse Courses",
          },
        ]}
      />

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Browse courses
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Everything available on the platform.
        </p>
      </div>

      {/* Course grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="flex h-full min-h-[260px] w-full flex-col"
          >
            <CardHeader className="space-y-4">
              {/* Title + enrollment */}
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="min-w-0 text-lg leading-7">
                  {course.title}
                </CardTitle>

                {course.isEnrolled && (
                  <Badge className="shrink-0 bg-green-100 text-green-700 hover:bg-green-100">
                    Enrolled
                  </Badge>
                )}
              </div>

              {/* Description */}
              <CardDescription className="text-sm leading-6">
                {course.description}
              </CardDescription>

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
            </CardHeader>

            {/* Bottom section */}
            <CardContent className="mt-auto flex items-center justify-between gap-4">
              {/* Price */}
              <div>
                {!course.isEnrolled && (
                  <span className="text-base font-semibold">
                    ₹{(course.priceCents / 100).toFixed(0)}
                  </span>
                )}
              </div>

              {/* Action */}
              <Button
                
                size="default"
                variant={
                  course.isEnrolled
                    ? "default"
                    : "outline"
                }
              >
                <Link href={`/courses/${course.id}`}>
                  {course.isEnrolled
                    ? "Go to course"
                    : "View & Buy"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}