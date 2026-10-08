"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  Search,
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

import { useBreadcrumbContext } from "@/src/context/breadcrumb-context";
import { useLessonNavigation } from "@/src/context/lesson-navigation-context";

export interface LessonNav {
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

export function Topbar({
  onSearchClick,
}: {
  onSearchClick: () => void;
}) {
  const lessonNav = useLessonNavigation();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1">
        <PanelLeft className="h-4 w-4" />
      </SidebarTrigger>

      <Separator orientation="vertical" className="h-4" />

      {lessonNav ? (
        <LessonNavigation nav={lessonNav} />
      ) : (
        <DashboardNavigation />
      )}

      {/* Search */}
      <Button
        variant="outline"
        size="sm"
        className="ml-auto gap-2"
        onClick={onSearchClick}
      >
        <Search className="h-4 w-4" />

        <span className="hidden sm:inline">
          Search
        </span>

        <kbd className="hidden rounded border bg-muted px-1.5 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </Button>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard navigation                                                       */
/* -------------------------------------------------------------------------- */

function DashboardNavigation() {
  const pathname = usePathname();
  const { items } = useBreadcrumbContext();

  if (!items?.length) {
    return (
      <div className="min-w-0">
        <span className="text-sm font-medium">
          Dashboard
        </span>
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1">
      <nav
        aria-label="breadcrumb"
        className="flex min-w-0 items-center"
      >
        <ol className="flex min-w-0 items-center gap-1.5 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={`${item.label}-${index}`}
                className="flex min-w-0 items-center gap-1.5"
              >
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="max-w-[220px] truncate text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="max-w-[220px] truncate font-medium">
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <span className="text-muted-foreground">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Lesson navigation                                                          */
/* -------------------------------------------------------------------------- */

function LessonNavigation({
  nav,
}: {
  nav: LessonNav;
}) {
  const currentLesson = nav.lessons.find(
    (lesson) => lesson.id === nav.currentLessonId,
  );

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
      {/* Course */}
      <Link
        href={`/dashboard/courses/${nav.course.id}`}
        className="max-w-[260px] shrink-0 truncate font-medium hover:underline"
      >
        {nav.course.title}
      </Link>

      <span className="shrink-0 text-muted-foreground">
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

        <DropdownMenuContent align="start" className="w-64">
          {nav.modules.map((module) => {
            const isCurrent =
              module.id === nav.currentModuleId;

            const hasLesson = Boolean(module.firstLessonId);

            if (isCurrent || !hasLesson) {
              return (
                <DropdownMenuItem
                  key={module.id}
                  disabled
                >
                  {module.title}
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={module.id}
                // asChild
              >
                <Link
                  href={`/dashboard/lessons/${module.firstLessonId}`}
                >
                  {module.title}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="shrink-0 text-muted-foreground">
        /
      </span>

      {/* Lesson */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 max-w-[220px] gap-1 px-2 font-normal"
          >
            <span className="truncate">
              {currentLesson?.title ?? "Lesson"}
            </span>

            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-72">
          {nav.lessons.map((lesson) => {
            const isCurrent =
              lesson.id === nav.currentLessonId;

            if (isCurrent) {
              return (
                <DropdownMenuItem
                  key={lesson.id}
                  disabled
                >
                  {lesson.title}
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={lesson.id}
                // asChild
              >
                <Link
                  href={`/dashboard/lessons/${lesson.id}`}
                >
                  {lesson.title}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right-side lesson controls */}
    <div className="ml-auto flex shrink-0 items-center gap-2 pl-4">
  {/* Previous */}
  {nav.prevLessonId ? (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      
    >
      <Link href={`/dashboard/lessons/${nav.prevLessonId}`}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous lesson</span>
      </Link>
    </Button>
  ) : (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      disabled
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous lesson</span>
    </Button>
  )}

  {/* Next */}
  {nav.nextLessonId ? (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      
    >
      <Link href={`/dashboard/lessons/${nav.nextLessonId}`}>
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next lesson</span>
      </Link>
    </Button>
  ) : (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      disabled
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next lesson</span>
    </Button>
  )}

  {/* Syllabus */}
  <Button
    variant="outline"
    size="sm"
    
  >
    <Link href={`/dashboard/courses/${nav.course.id}`}>
      Syllabus
    </Link>
  </Button>

  <Separator
    orientation="vertical"
    className="h-4"
  />

  {/* Courses */}
  <Button
    variant="ghost"
    size="sm"
    
  >
    <Link href="/dashboard/courses">
      Courses
    </Link>
  </Button>
</div>
    </div>
  );
}