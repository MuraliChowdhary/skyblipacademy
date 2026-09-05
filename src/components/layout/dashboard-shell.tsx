"use client";

import { useState, type ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/layout/app-sidebar";
import { Topbar } from "@/src/components/layout/topbar";
import { CommandMenu } from "@/src/components/layout/command-menu";

type Role = "STUDENT" | "ADMIN";

export function DashboardShell({ role, children }: { role: Role; children: ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Topbar onSearchClick={() => setCommandOpen(true)} />
        <main className="flex flex-1 flex-col gap-6 p-6">{children}</main>
      </SidebarInset>
      <CommandMenu role={role} open={commandOpen} onOpenChange={setCommandOpen} />
    </SidebarProvider>
  );
}
