import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Users,
} from "lucide-react";

import Link from "next/link";

import AdminLogoutButton from "@/src/components/admin/AdminLogoutButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";

import { checkDatabase } from "@/src/lib/database/health";
import DatabaseStatusBanner from "@/src/components/admin/DatabaseStatusBanner";

const navItems = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    label: "Submissions",
    href: "/admin/submissions",
    icon: ClipboardCheck,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const database = await checkDatabase();

  let isAdmin = false;

  if (database.ok) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
      },
    });

    isAdmin =
      user?.role === "ADMIN" ||
      session.user.role === "ADMIN";
  } else {
    isAdmin = session.user.role === "ADMIN";
  }

  if (!isAdmin) {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar collapsible="icon">
          {/* Header */}
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="hover:bg-transparent"
                  tooltip="Admin Panel"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    A
                  </div>

                  <div className="flex min-w-0 flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-semibold">
                      Admin Panel
                    </span>

                    <span className="truncate text-xs text-muted-foreground">
                      SkyBlip Academy
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* Navigation */}
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    // asChild
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <div className="flex gap-3">
                        <item.icon />
                      <span>{item.label}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          {/* Footer */}
          <SidebarFooter>
            <AdminLogoutButton />
          </SidebarFooter>
        </Sidebar>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-14 shrink-0 items-center border-b px-4">
            <SidebarTrigger />
          </header>

          {/* Database status */}
          {!database.ok && <DatabaseStatusBanner />}

          {/* Content */}
          <div className="min-w-0 flex-1 p-4 md:p-6">
            {database.ok && children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}