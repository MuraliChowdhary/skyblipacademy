import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { DashboardShell } from "@/src/components/layout/dashboard-shell";
import { BreadcrumbProvider } from "@/src/context/breadcrumb-context";

// Real protection lives here (a server component, can't be bypassed by
// disabling JS) — proxy.ts's edge check is a fast-path in front of this,
// not a replacement for it.
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (<BreadcrumbProvider> 
      <DashboardShell role={session.user.role}>{children}</DashboardShell>
      </BreadcrumbProvider>);
}
