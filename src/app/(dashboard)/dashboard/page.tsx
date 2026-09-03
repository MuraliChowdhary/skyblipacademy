"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/src/components/ui/button";
import { useCurrentUser } from "@/src/hooks/session";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    isLoading,
    isAuthenticated,
  } = useCurrentUser();

  // While NextAuth checks the session
  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading dashboard...
        </p>
      </main>
    );
  }

  // No authenticated user
  if (!isAuthenticated || !user) {
    router.push("/login");

    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Redirecting to login...
        </p>
      </main>
    );
  }

  async function handleSignOut() {
    await signOut({
      callbackUrl: "/",
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Welcome back
          </p>

          <h1 className="text-3xl font-bold">
            {user.name ?? user.email}
          </h1>
        </div>

        <Button
          variant="outline"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <DashboardCard
          title="My Courses"
          description="View your enrolled courses and continue learning."
          href="/dashboard/courses"
          action="View courses"
        />

        <DashboardCard
          title="Profile"
          description="Manage your account and personal information."
          href="/dashboard/profile"
          action="View profile"
        />

        <DashboardCard
          title="Explore Courses"
          description="Discover new programs available at SkyBlip Academy."
          href="/courses"
          action="Explore"
        />
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>

      <Button className="mt-6">
        <Link href={href}>
          {action}
        </Link>
      </Button>
    </div>
  );
}