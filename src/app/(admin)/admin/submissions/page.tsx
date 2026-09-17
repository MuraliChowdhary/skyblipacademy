// src/app/(admin)/admin/submissions/page.tsx

import { listSubmissionsForReview } from "@/src/backend/admin/review.service";
import { SubmissionCard } from "@/src/components/admin/submission-card";
import { auth } from "@/src/lib/auth";
import { requireRole } from "@/src/lib/require-session";

export default async function AdminSubmissionsPage() {
 const session = await auth();
  const user = requireRole(session, "ADMIN");
  const submissions = await listSubmissionsForReview();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Submissions to review</h1>
      {submissions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing waiting on review.</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <SubmissionCard
              key={s.id}
              submission={{
                id: s.id,
                prUrl: s.prUrl,
                status: s.status,
                userName: s.user.name,
                userEmail: s.user.email,
                assignmentTitle: s.assignment.title,
                lessonId: s.assignment.lessonId,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}