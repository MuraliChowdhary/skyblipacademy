import type { ReactNode } from "react";

import { getLessonNav } from "@/src/backend/services/lesson-nav.service";
import { DashboardShell } from "@/src/components/layout/dashboard-shell";
import { LessonNavigationProvider } from "@/src/context/lesson-navigation-context";
import { BreadcrumbProvider } from "@/src/context/breadcrumb-context";
import { requireUser } from "@/src/lib/require-user";

export default async function LessonLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const userId = await requireUser();

  const nav = await getLessonNav(userId, lessonId);

  console.log("LESSON NAV:", nav);

  return (
    <LessonNavigationProvider nav={nav}>
      <BreadcrumbProvider>
        <DashboardShell role="STUDENT">
          {children}
        </DashboardShell>
      </BreadcrumbProvider>
    </LessonNavigationProvider>
  );
}