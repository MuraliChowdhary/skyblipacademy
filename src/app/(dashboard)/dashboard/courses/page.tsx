"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { useCurrentUser } from "@/src/hooks/session";

type Enrollment = {
  id: string;
  course: {
    id: string;
    slug: string;
    title: string;
  };
};

type EnrollmentResponse = {
  success: boolean;
  data: Enrollment[];
};

export default function MyCoursesPage() {
  const { isLoading: isSessionLoading, isAuthenticated } =
    useCurrentUser();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSessionLoading) return;

    if (!isAuthenticated) {
      return;
    }

    async function fetchEnrollments() {
      try {
        setError(null);

        const response = await fetch("/api/me/enrollments");

        if (!response.ok) {
          throw new Error("Failed to fetch enrollments");
        }

        const result: EnrollmentResponse = await response.json();

        if (!result.success) {
          throw new Error("Unable to load your courses");
        }

        setEnrollments(result.data);
      } catch (error) {
        console.error(error);
        setError("Unable to load your courses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEnrollments();
  }, [isSessionLoading, isAuthenticated]);

  if (isSessionLoading || (isAuthenticated && isLoading)) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading your courses...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">
          Please sign in
        </h1>

        <p className="text-muted-foreground">
          You need to sign in to view your courses.
        </p>

        <Button>
          <Link href="/login">
            Sign in
          </Link>
        </Button>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-600">
          {error}
        </p>

        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div>
        <p className="text-sm text-muted-foreground">
          LEARNING DASHBOARD
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          My Courses
        </h1>

        <p className="mt-2 text-muted-foreground">
          Continue learning where you left off.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <section className="mt-10 rounded-xl border border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold">
            No courses yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Explore our programs and start your learning journey.
          </p>

          <Button  className="mt-6">
            <Link href="/courses">
              Explore Courses
            </Link>
          </Button>
        </section>
      ) : (
        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => (
            <article
              key={enrollment.id}
              className="flex min-h-[220px] flex-col rounded-xl border bg-card p-6"
            >
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  ENROLLED COURSE
                </span>

                <h2 className="mt-3 text-xl font-semibold">
                  {enrollment.course.title}
                </h2>
              </div>

              <Button  className="mt-auto w-full">
                <Link
                  href={`/dashboard/courses/${enrollment.course.slug}`}
                >
                  Continue Learning
                </Link>
              </Button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}