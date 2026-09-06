// src/components/lesson/assignment-panel.tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";

interface Assignment {
  id: string;
  title: string;
  tier: "INLINE" | "REPO" | "OPEN_ENDED";
  instructions: string;
  starterRepoUrl: string | null;
  submission: { prUrl: string; status: string; reviewNote: string | null } | null;
}

const statusLabel: Record<string, string> = {
  SUBMITTED: "Submitted",
  IN_REVIEW: "In review",
  CHANGES_REQUESTED: "Changes requested",
  APPROVED: "Approved",
};

export function AssignmentPanel({ assignment }: { assignment: Assignment | null }) {
  const [prUrl, setPrUrl] = useState(assignment?.submission?.prUrl ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(assignment?.submission ?? null);

  if (!assignment) {
    return <p className="text-sm text-muted-foreground">Assignment for this lesson is coming soon.</p>;
  }

  const submit = async () => {
    setSubmitting(true);
    const res = await fetch(`/api/assignments/${assignment.id}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prUrl }),
    });
    const json = await res.json();
    setSubmitting(false);
    if (json.success) setSubmission(json.data);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{assignment.title}</h3>
        {submission && <Badge variant="secondary">{statusLabel[submission.status]}</Badge>}
      </div>

      <div className="prose prose-neutral prose-sm max-w-none dark:prose-invert">
        <p>{assignment.instructions}</p>
      </div>

      {assignment.tier === "REPO" && assignment.starterRepoUrl && (
        <Button variant="outline" size="sm">
          <a href={assignment.starterRepoUrl} target="_blank" rel="noopener noreferrer">
            Open starter repo
          </a>
        </Button>
      )}

      {submission?.status === "CHANGES_REQUESTED" && submission.reviewNote && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:bg-amber-950/30">
          <p className="font-medium">Reviewer note</p>
          <p className="text-muted-foreground">{submission.reviewNote}</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Submit your PR</label>
        <div className="flex gap-2">
          <Input
            placeholder="https://github.com/you/repo/pull/1"
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
          />
          <Button onClick={submit} disabled={submitting || !prUrl}>
            {submission ? "Resubmit" : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}