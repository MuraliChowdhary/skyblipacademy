// src/components/admin/submission-card.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";

interface Submission {
  id: string;
  prUrl: string;
  status: string;
  userName: string;
  userEmail: string;
  assignmentTitle: string;
  lessonId: string;
}

export function SubmissionCard({ submission }: { submission: Submission }) {
  const [status, setStatus] = useState(submission.status);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState<"APPROVED" | "CHANGES_REQUESTED" | null>(null);

  const review = async (nextStatus: "APPROVED" | "CHANGES_REQUESTED") => {
    setLoading(nextStatus);
    const res = await fetch(`/api/admin/submissions/${submission.id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, reviewNote: note || undefined }),
    });
    if ((await res.json()).success) setStatus(nextStatus);
    setLoading(null);
  };

  const resolved = status === "APPROVED" || status === "CHANGES_REQUESTED";

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium">{submission.assignmentTitle}</p>
            <p className="text-xs text-muted-foreground">{submission.userName} · {submission.userEmail}</p>
          </div>
          <Badge variant={status === "APPROVED" ? "default" : status === "CHANGES_REQUESTED" ? "destructive" : "secondary"}>
            {status}
          </Badge>
        </div>

        <a href={submission.prUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> View PR
        </a>

        {!resolved && (
          <>
            <Textarea
              placeholder="Optional note for the student..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => review("APPROVED")} disabled={loading !== null}>
                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => review("CHANGES_REQUESTED")} disabled={loading !== null}>
                <XCircle className="mr-1.5 h-4 w-4" /> Request changes
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}