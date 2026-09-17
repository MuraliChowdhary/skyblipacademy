
import { getPlatformOverview } from "@/src/backend/admin/analytics.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { requireRole } from "@/src/lib/require-session";

export default async function AdminOverviewPage() {
  
    const session = await auth();
  const user = requireRole(session, "ADMIN");
  
  const stats = await getPlatformOverview();

  const cards = [
    { label: "Total users", value: stats.totalUsers },
    { label: "Enrollments", value: stats.totalEnrollments },
    { label: "Revenue", value: `₹${(stats.totalRevenueCents / 100).toFixed(0)}` },
    { label: "Pending reviews", value: stats.pendingReviews },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Overview</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-normal text-muted-foreground">{c.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}