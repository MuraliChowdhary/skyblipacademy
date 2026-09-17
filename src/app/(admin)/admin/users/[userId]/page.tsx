// src/app/(admin)/admin/users/[userId]/page.tsx

import { GrantEnrollmentForm } from "@/src/components/admin/grant-enrollment-form";
import { RevokeEnrollmentButton } from "@/src/components/admin/revoke-enrollment-button";
import { getUserDetail } from "@/src/backend/admin/user-admin.service";
import { Badge } from "@/src/components/ui/badge";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { requireRole } from "@/src/lib/require-session";


export default async function AdminUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
 const session = await auth();
 requireRole(session, "ADMIN");

  const { userId } = await params;
  const [user, allCourses] = await Promise.all([
    getUserDetail(userId),
    prisma.course.findMany({ select: { id: true, title: true } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold">{user.name}</h1>
        <p className="text-sm text-muted-foreground">
          {user.email} · <Badge variant="secondary">{user.role}</Badge>
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Enrollments</h2>
          <GrantEnrollmentForm userId={user.id} courses={allCourses} />
        </div>
        <div className="divide-y rounded-lg border">
          {user.enrollments.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3">
              <span className="text-sm">{e.course.title}</span>
              <RevokeEnrollmentButton userId={user.id} courseId={e.courseId} />
            </div>
          ))}
          {user.enrollments.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">No enrollments.</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Recent orders</h2>
        <div className="divide-y rounded-lg border">
          {user.orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between p-3 text-sm">
              <span>₹{(o.amountCents / 100).toFixed(0)}</span>
              <Badge variant={o.status === "PAID" ? "default" : "secondary"}>{o.status}</Badge>
            </div>
          ))}
          {user.orders.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">No orders.</p>
          )}
        </div>
      </section>
    </div>
  );
}