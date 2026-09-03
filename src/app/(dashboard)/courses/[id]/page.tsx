"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Loader2,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/components/ui/alert";
import Image from "next/image";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  syllabus: string | null;
  imageUrl?: string | null;
  priceCents: number;
  currency: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type CourseResponse = {
  success: boolean;
  data: Course;
};

function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(priceCents / 100);
}

export default function CourseDetailsPage() {
  const params = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/courses/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to load course");
        }

        const result: CourseResponse = await response.json();

        if (!result.success || !result.data) {
          throw new Error("Course not found");
        }

        setCourse(result.data);
      } catch (error) {
        console.error(error);
        setError("Unable to load this course.");
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading course...</span>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6">
        <Alert variant="destructive">
          <AlertTitle>Unable to load course</AlertTitle>

          <AlertDescription className="mt-3">
            {error ?? "The course you are looking for does not exist."}
          </AlertDescription>

          <Button variant="outline" className="mt-4">
            <Link href="/courses">
              <ArrowLeft className="mr-2 size-4" />
              Back to Courses
            </Link>
          </Button>
        </Alert>
      </main>
    );
  }

  const imageUrl = course.syllabus;

  return (
    <main className="bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-8 -ml-3"
        >
          <Link href="/courses">
            <ArrowLeft className="mr-2 size-4" />
            Back to Courses
          </Link>
        </Button>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            {/* Hero */}
            <section>
              <Badge
                variant="secondary"
                className="mb-5 gap-2 px-3 py-1"
              >
                <GraduationCap className="size-3.5" />
                Professional Program
              </Badge>

              <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
                {course.title}
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                {course.description}
              </p>
            </section>

            {/* Course image */}
            {imageUrl && (
              <Card className="overflow-hidden">
                <div className="relative w-full">
                <Image
                    src={imageUrl}
                    alt={`${course.title} syllabus`}
                    width={1200}
                    height={1600}
                    className="h-auto w-full"
                />
                </div>
              </Card>
            )}

            {/* About */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <BookOpen className="size-5 text-primary" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">
                      About this program
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      What you&apos;ll be learning
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <p className="leading-7 text-muted-foreground">
                  {course.description}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <CourseFeature>
                    Production-focused learning
                  </CourseFeature>

                  <CourseFeature>
                    Practical projects and skills
                  </CourseFeature>

                  <CourseFeature>
                    Structured learning program
                  </CourseFeature>

                  <CourseFeature>
                    Full program access
                  </CourseFeature>
                </div>
              </CardContent>
            </Card>

            {/* Syllabus */}
            {course.syllabus && (
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <BookOpen className="size-5 text-primary" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold">
                        Course Syllabus
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        Topics covered in this program
                      </p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="whitespace-pre-wrap leading-7 text-muted-foreground">
                    {course.syllabus}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT SIDE - PURCHASE CARD */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="overflow-hidden shadow-lg">
              {imageUrl && (
                <div className="relative w-full">
                <Image
                    src={imageUrl}
                    alt={`${course.title} syllabus`}
                    width={1200}
                    height={1600}
                    className="h-auto w-full"
                />
                </div>
              )}

              <CardContent className="p-6">
                <BadgeCheck className="size-6 text-primary" />

                <h2 className="mt-4 text-xl font-semibold">
                  Start this program
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Get access to the complete learning program.
                </p>

                <Separator className="my-6" />

                <div>
                  <p className="text-sm text-muted-foreground">
                    Program price
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {formatPrice(
                      course.priceCents,
                      course.currency
                    )}
                  </p>
                </div>

                <Button
                  size="lg"
                  className="mt-6 w-full"
                >
                  <ShoppingBag className="mr-2 size-5" />
                  Buy Course
                </Button>

                <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-primary" />
                    Full program access
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-primary" />
                    Learn at your own pace
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="size-4 text-primary" />
                    Secure payment
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CourseFeature({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
      <CheckCircle2 className="size-5 shrink-0 text-primary" />

      <span className="text-sm font-medium">
        {children}
      </span>
    </div>
  );
}