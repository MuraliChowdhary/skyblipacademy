import type { ReactNode } from "react";

import { auth } from "@/src/lib/auth";
import { DashboardShell } from "@/src/components/layout/dashboard-shell";
import { BreadcrumbProvider } from "@/src/context/breadcrumb-context";
import { LessonNavigationProvider } from "@/src/context/lesson-navigation-context";

export default async function MainDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <LessonNavigationProvider nav={null}>
      <BreadcrumbProvider>
        <DashboardShell role={session.user.role}>
          {children}
        </DashboardShell>
      </BreadcrumbProvider>
    </LessonNavigationProvider>
  );
}