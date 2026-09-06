// src/app/(dashboard)/page.tsx
import Link from "next/link";
import { requireUser } from "@/src/lib/require-user";
import { getUserCourses } from "@/src/backend/services/course-progress.service";
import {
  getContinueLearning,
  getWhatsNew,
  getPendingWork,
  getUserStats,
  getFeaturedCourses,
} from "@/src/backend/services/home.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Bell, ClipboardList, Compass } from "lucide-react";

const statusLabel: Record<string, string> = {
  SUBMITTED: "Awaiting review",
  IN_REVIEW: "In review",
  CHANGES_REQUESTED: "Changes requested",
};

export default async function HomePage() {
  const userId = await requireUser();
  const courses = await getUserCourses(userId);

  // ---------- Empty state ----------
  if (courses.length === 0) {
    const featured = await getFeaturedCourses([]);
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-8 text-center">
        <Compass className="mx-auto h-8 w-8 text-muted-foreground" />
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Nothing enrolled yet</h1>
          <p className="text-sm text-muted-foreground">
            Pick a course to get started — your progress and next steps will show up right here.
          </p>
        </div>
        <Button>
          <Link href="/courses">Browse courses</Link>
        </Button>
        <div className="grid grid-cols-1 gap-4 pt-4 text-left sm:grid-cols-3">
          {featured.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const [continueLearning, whatsNew, pendingWork, stats] = await Promise.all([
    getContinueLearning(userId),
    getWhatsNew(userId),
    getPendingWork(userId),
    getUserStats(userId),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8">
      {/* A. Continue where you left off */}
      {continueLearning.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Continue where you left off</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {continueLearning.map((item) => (
              <Card key={item.lessonId}>
                <CardContent className="space-y-3 pt-6">
                  <p className="text-xs text-muted-foreground">{item.courseTitle}</p>
                  <p className="text-sm font-medium">{item.lessonTitle}</p>
                  <Button size="sm" className="w-full">
                    <Link href={`/dashboard/lessons/${item.lessonId}`}>Resume</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* B. What's new for you */}
      {whatsNew.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Bell className="h-4 w-4" /> What&apos;s new for you
          </h2>
          <div className="divide-y rounded-lg border">
            {whatsNew.map((item, i) => (
              <Link
                key={i}
                href={`/dashboard/lessons/${item.lessonId}`}
                className="block p-3 text-sm transition-colors hover:bg-muted/50"
              >
                {item.text}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* C. Your courses */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Your courses</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const pct = course.totalLessons
              ? Math.round((course.completedLessons / course.totalLessons) * 100)
              : 0;
            return (
              <Link key={course.courseId} href={`/dashboard/courses/${course.courseId}`}>
                <Card className="h-full transition-colors hover:border-primary/50">
                  <CardHeader>
                    <CardTitle className="text-base">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Progress value={pct} />
                    <p className="text-xs text-muted-foreground">
                      {course.completedLessons} of {course.totalLessons} lessons complete
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* D. Pending work */}
      {pendingWork.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ClipboardList className="h-4 w-4" /> Pending work
          </h2>
          <div className="divide-y rounded-lg border">
            {pendingWork.map((item, i) => (
              <Link
                key={i}
                href={`/dashboard/lessons/${item.lessonId}`}
                className="flex items-center justify-between p-3 text-sm transition-colors hover:bg-muted/50"
              >
                <span>{item.assignmentTitle}</span>
                <Badge variant={item.status === "CHANGES_REQUESTED" ? "destructive" : "secondary"}>
                  {statusLabel[item.status]}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* E. Stats strip */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Courses in progress" value={stats.coursesInProgress} />
        <StatCard label="Lessons completed" value={stats.lessonsCompleted} />
        <StatCard label="Invested in learning" value={`₹${(stats.investedCents / 100).toFixed(2)}`} />
        <StatCard
          label="Member since"
          value={stats.memberSince.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        />
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="space-y-1 pt-6">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}