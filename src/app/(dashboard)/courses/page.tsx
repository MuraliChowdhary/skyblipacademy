"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/src/components/ui/button";

type Course = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
};

type CoursesResponse = {
  success: boolean;
  data: Course[];
};

function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses");

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const result: CoursesResponse = await response.json();

        if (!result.success) {
          throw new Error("Unable to load courses");
        }

        setCourses(result.data);
      } catch (error) {
        console.error(error);
        setError("Unable to load courses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-muted-foreground">
          Loading courses...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>

        <Button onClick={() => window.location.reload()}>
          Try again
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16">
      {/* Header */}
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium text-muted-foreground">
          SKYBLIP ACADEMY
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Explore Our Programs
        </h1>

        <p className="mt-5 text-lg text-muted-foreground">
          Build practical skills in software engineering,
          cybersecurity, and AI.
        </p>
      </section>

      {/* Courses */}
      <section className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <article
            key={course.id}
            className="flex min-h-[280px] flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                Program
              </span>

              <h2 className="mt-5 text-xl font-semibold">
                {course.title}
              </h2>
            </div>

            <div className="mt-auto pt-8">
              <p className="text-2xl font-bold">
                {formatPrice(
                  course.priceCents,
                  course.currency
                )}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Full program access
              </p>

              <Button  className="mt-6 w-full">
                <Link href={`/courses/${course.id}`}>
                  View Course
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </section>

      {/* Empty state */}
      {courses.length === 0 && (
        <div className="py-20 text-center">
          <h2 className="text-xl font-semibold">
            No courses available
          </h2>

          <p className="mt-2 text-muted-foreground">
            Please check back later.
          </p>
        </div>
      )}
    </main>
  );
}