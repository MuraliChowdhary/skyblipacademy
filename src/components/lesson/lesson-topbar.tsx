"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { SidebarTrigger } from "@/src/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface LessonNav {
  course: {
    id: string;
    title: string;
  };

  modules: {
    id: string;
    title: string;
    firstLessonId?: string | null;
  }[];

  currentModuleId: string;
  currentModuleTitle: string;

  lessons: {
    id: string;
    title: string;
  }[];

  currentLessonId: string;

  prevLessonId: string | null;
  nextLessonId: string | null;
}

export function LessonTopbar({
  nav,
}: {
  nav: LessonNav;
}) {
  const currentLesson =
    nav.lessons.find(
      (lesson) => lesson.id === nav.currentLessonId,
    );
    const router = useRouter()
  return (
    <header className="flex h-14 w-full shrink-0 items-center border-b bg-background px-3 sm:px-4">
      {/* Left */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Sidebar */}
        <SidebarTrigger
          className="shrink-0"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </SidebarTrigger>

        <Separator
          orientation="vertical"
          className="mx-1 h-5 shrink-0"
        />

        {/* Navigation */}
        <nav className="flex min-w-0 items-center gap-1 text-sm">
          {/* Course */}
          <Link
            href={`/dashboard/courses/${nav.course.id}`}
            className="hidden max-w-[260px] truncate font-medium text-foreground hover:underline sm:block"
            title={nav.course.title}
          >
            {nav.course.title}
          </Link>

          <span className="hidden text-muted-foreground sm:block">
            /
          </span>

          {/* Module */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 max-w-[180px] gap-1 px-2 font-normal"
              >
                <span className="truncate">
                  {nav.currentModuleTitle}
                </span>

                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-[240px]"
            >
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Modules
              </div>

              {nav.modules.map((module) => {
                const isCurrent =
                  module.id === nav.currentModuleId;

                /*
                 * Prefer the module's first lesson.
                 * This keeps module navigation inside the
                 * lesson flow instead of relying on a hash.
                 */
                const destination =
                  module.firstLessonId
                    ? `/dashboard/lessons/${module.firstLessonId}`
                    : `/dashboard/courses/${nav.course.id}`;

                return (
                  <DropdownMenuItem
                key={module.id}
                disabled={isCurrent}
                onSelect={() => {
                  if (!isCurrent) {
                    router.push(destination);
                  }
                }}
              >
                <span className={isCurrent ? "font-medium" : ""}>
                  {module.title}
                </span>
              </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-muted-foreground">
            /
          </span>

          {/* Lesson / Topic */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 max-w-[240px] gap-1 px-2 font-normal"
              >
                <span className="truncate">
                  {currentLesson?.title ?? "Lesson"}
                </span>

                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-[280px]"
            >
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Topics
              </div>

              {nav.lessons.map((lesson) => {
                const isCurrent =
                  lesson.id === nav.currentLessonId;

                return (
                  <DropdownMenuItem
                key={lesson.id}
                disabled={isCurrent}
                onSelect={() => {
                  if (!isCurrent) {
                    router.push(`/dashboard/lessons/${lesson.id}`);
                  }
                }}
              >
                <span className={isCurrent ? "font-medium" : "truncate"}>
                  {lesson.title}
                </span>
              </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Right controls */}
      <div className="ml-2 flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Previous */}
        {nav.prevLessonId ? (
          <Button
            // asChild
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Link
              href={`/dashboard/lessons/${nav.prevLessonId}`}
              aria-label="Previous lesson"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled
            aria-label="No previous lesson"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Next */}
        {nav.nextLessonId ? (
          <Button
            // asChild
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Link
              href={`/dashboard/lessons/${nav.nextLessonId}`}
              aria-label="Next lesson"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled
            aria-label="No next lesson"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {/* Syllabus */}
        <Button
          
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex"
        >
          <Link
            href={`/dashboard/courses/${nav.course.id}`}
          >
            Syllabus
          </Link>
        </Button>

        <Separator
          orientation="vertical"
          className="mx-1 hidden h-5 sm:block"
        />

        {/* Courses */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:inline-flex"
        >
          <Link href="/dashboard/courses">
            Courses
          </Link>
        </Button>
      </div>
    </header>
  );
} 