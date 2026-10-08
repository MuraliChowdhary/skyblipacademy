// src/app/(dashboard)/layout.tsx

import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/src/lib/auth";

export default async function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return children;
}