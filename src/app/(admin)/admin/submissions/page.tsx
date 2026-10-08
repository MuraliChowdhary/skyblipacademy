// src/app/(admin)/admin/submissions/page.tsx

import { SubmissionTable } from "@/src/components/admin/submission-table";

export default function AdminSubmissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Submissions
        </h1>

        <p className="text-sm text-muted-foreground">
          Review and manage student submissions.
        </p>
      </div>

      <SubmissionTable/>
    </div>
  );
}