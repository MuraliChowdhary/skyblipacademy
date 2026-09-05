import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";

// Nests inside the (dashboard) layout above, which already rendered the
// shell — this layer only adds the extra role check. A STUDENT
// navigating straight to /admin/... by URL lands back on /dashboard,
// not a broken or half-rendered admin page.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return children;
}
