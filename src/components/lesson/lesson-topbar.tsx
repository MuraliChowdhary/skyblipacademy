// src/components/lesson/lesson-topbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, PanelLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/src/components/ui/sidebar";

interface LessonNav {
  course: { id: string; title: string };
  modules: { id: string; title: string }[];
  currentModuleId: string;
  currentModuleTitle: string;
  lessons: { id: string; title: string }[];
  currentLessonId: string;
  prevLessonId: string | null;
  nextLessonId: string | null;
}

export function LessonTopbar({ nav }: { nav: LessonNav }) {
  const router = useRouter();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1">
        <PanelLeft className="h-4 w-4" />
      </SidebarTrigger>
      <Separator orientation="vertical" className="h-4" />

      <nav className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link href={`/dashboard/courses/${nav.course.id}`} className="truncate font-medium hover:underline">
          {nav.course.title}
        </Link>

        <span className="text-muted-foreground">/</span>

        {/* Module switcher — jumps to that module's first lesson */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 font-normal">
              {nav.currentModuleTitle}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {nav.modules.map((m) => (
              <DropdownMenuItem
                key={m.id}
                disabled={m.id === nav.currentModuleId}
                onClick={() => router.push(`/courses/${nav.course.id}#${m.id}`)}
              >
                {m.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-muted-foreground">/</span>

        {/* Lesson switcher — within the current module */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 font-normal">
              {nav.lessons.find((l) => l.id === nav.currentLessonId)?.title ?? "Lesson"}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {nav.lessons.map((l) => (
              <DropdownMenuItem key={l.id} disabled={l.id === nav.currentLessonId}>
                <Link href={`/dashboard/lessons/${l.id}`}>{l.title}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {nav.prevLessonId ? (
          <Link
            href={`/dashboard/lessons/${nav.prevLessonId}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Previous lesson"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm opacity-50">
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}

        {nav.nextLessonId ? (
          <Link
            href={`/dashboard/lessons/${nav.nextLessonId}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Next lesson"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm opacity-50">
            <ChevronRight className="h-4 w-4" />
          </span>
        )}

        <Button variant="outline" size="sm">
          <Link href={`/dashboard/courses/${nav.course.id}`}>Syllabus</Link>
        </Button>

        <Separator orientation="vertical" className="h-4" />

        <Button variant="ghost" size="sm" >
          <Link href="/courses">Courses</Link>
        </Button>
      </div>
    </header>
  );
}