"use client";

import { GraduationCap, Receipt, Sparkles } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { StatCard } from "@/src/components/dashboard/stat-card";
import { useEnrollments } from "@/src/hooks/use-enrollments";
import { useOrders } from "@/src/hooks/use-orders";
import { useProfile } from "@/src/hooks/use-profile";
import { formatCurrency, formatDate } from "@/src/lib/format";
import { useCurrentUser } from "@/src/hooks/session";

export default function StudentHomePage() {
  const { user } = useCurrentUser();
  const enrollments = useEnrollments();
  const orders = useOrders();
  const profile = useProfile();

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const totalInvestedCents = (orders.data ?? [])
    .filter((order) => order.status === "PAID")
    .reduce((sum, order) => sum + order.amountCents, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-medium">Welcome back, {firstName}.</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every session compounds — pick up exactly where you left off.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {enrollments.isLoading ? (
          <Skeleton className="h-[92px]" />
        ) : (
          <StatCard
            title="Courses in progress"
            value={String(enrollments.data?.length ?? 0)}
            icon={GraduationCap}
          />
        )}

        {orders.isLoading ? (
          <Skeleton className="h-[92px]" />
        ) : (
          <StatCard
            title="Invested in your learning"
            value={formatCurrency(totalInvestedCents, "INR")}
            icon={Receipt}
          />
        )}

        {profile.isLoading ? (
          <Skeleton className="h-[92px]" />
        ) : (
          <StatCard
            title="Member since"
            value={profile.data ? formatDate(profile.data.createdAt) : "—"}
            icon={Sparkles}
            hint="Glad you're here"
          />
        )}
      </div>
    </div>
  );
}
