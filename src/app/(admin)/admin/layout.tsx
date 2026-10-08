import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Submissions", href: "/admin/submissions", icon: ClipboardCheck },
  { label: "Users", href: "/admin/users", icon: Users },
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

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (user?.role !== "ADMIN" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r p-4">
        <p className="mb-4 px-2 text-xs font-semibold uppercase text-muted-foreground">
          Admin
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}