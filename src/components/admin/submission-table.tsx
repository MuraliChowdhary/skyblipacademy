"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";

type SubmissionStatus =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "APPROVED"
  | "CHANGES_REQUESTED";

type StatusFilter = "ALL" | SubmissionStatus;

type Submission = {
  id: string;
  prUrl: string;
  status: SubmissionStatus;
  submittedAt: string | Date | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  assignment: {
    id: string;
    title: string;
    lessonId: string;
  };
};

type ReviewStatus =
  | "IN_REVIEW"
  | "APPROVED"
  | "CHANGES_REQUESTED";

const statusOptions: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "ALL", label: "All submissions" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "CHANGES_REQUESTED", label: "Changes Requested" },
];

const reviewOptions: {
  value: ReviewStatus;
  label: string;
}[] = [
  {
    value: "IN_REVIEW",
    label: "Mark In Review",
  },
  {
    value: "APPROVED",
    label: "Approve",
  },
  {
    value: "CHANGES_REQUESTED",
    label: "Request Changes",
  },
];

function StatusBadge({
  status,
}: {
  status: SubmissionStatus;
}) {
  switch (status) {
    case "SUBMITTED":
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
        >
          <Send className="mr-1.5 h-3 w-3" />
          Submitted
        </Badge>
      );

    case "IN_REVIEW":
      return (
        <Badge
          variant="outline"
          className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        >
          <Clock3 className="mr-1.5 h-3 w-3" />
          In Review
        </Badge>
      );

    case "APPROVED":
      return (
        <Badge
          variant="outline"
          className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          <CheckCircle2 className="mr-1.5 h-3 w-3" />
          Approved
        </Badge>
      );

    case "CHANGES_REQUESTED":
      return (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          <XCircle className="mr-1.5 h-3 w-3" />
          Changes Requested
        </Badge>
      );
  }
}

function formatDate(date: string | Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getInitials(name: string | null) {
  if (!name) return "U";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function SubmissionTable() {
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const [reviewStatus, setReviewStatus] =
    useState<ReviewStatus>("IN_REVIEW");

  const [reviewNote, setReviewNote] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const fetchSubmissions = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const params = new URLSearchParams();

        if (status !== "ALL") {
          params.set("status", status);
        }

        const query = params.toString();

        const response = await fetch(
          `/api/admin/submissions${query ? `?${query}` : ""}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error?.message ||
              "Failed to load submissions.",
          );
        }

        /*
         * Supports either:
         *
         * response = [...]
         *
         * or:
         *
         * response = { data: [...] }
         */
        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        setSubmissions(data);
      } catch (error) {
        console.error("[SUBMISSIONS_FETCH_ERROR]", error);

        toast.error("Unable to load submissions", {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [status],
  );

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const filteredSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return submissions;
    }

    return submissions.filter((submission) => {
      return (
        submission.user.name
          ?.toLowerCase()
          .includes(query) ||
        submission.user.email
          ?.toLowerCase()
          .includes(query) ||
        submission.assignment.title
          .toLowerCase()
          .includes(query)
      );
    });
  }, [submissions, search]);

  function openReviewDialog(
    submission: Submission,
  ) {
    setSelectedSubmission(submission);

    if (submission.status === "SUBMITTED") {
      setReviewStatus("IN_REVIEW");
    } else {
      setReviewStatus("APPROVED");
    }

    setReviewNote("");
  }

  function closeReviewDialog() {
    if (reviewing) return;

    setSelectedSubmission(null);
    setReviewNote("");
  }

  async function submitReview() {
    if (!selectedSubmission) return;

    try {
      setReviewing(true);

      const response = await fetch(
        `/api/admin/submissions/${selectedSubmission.id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: reviewStatus,
            reviewNote: reviewNote.trim() || undefined,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error?.message ||
            "Failed to update submission.",
        );
      }

      toast.success("Submission reviewed", {
        description:
          reviewStatus === "APPROVED"
            ? "The submission has been approved."
            : reviewStatus === "CHANGES_REQUESTED"
              ? "Changes have been requested."
              : "The submission is now in review.",
      });

      setSelectedSubmission(null);
      setReviewNote("");

      await fetchSubmissions(true);

      router.refresh();
    } catch (error) {
      console.error("[SUBMISSION_REVIEW_ERROR]", error);

      toast.error("Unable to update submission", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
      });
    } finally {
      setReviewing(false);
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search students or assignments..."
                className="pl-9"
              />
            </div>

            {/* Status */}
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as StatusFilter)
              }
            >
              <SelectTrigger className="w-full sm:w-[210px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchSubmissions(true)}
            disabled={loading || refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {filteredSubmissions.length}{" "}
              {filteredSubmissions.length === 1
                ? "submission"
                : "submissions"}
            </p>

            <p className="text-xs text-muted-foreground">
              {status === "ALL"
                ? "All student submissions"
                : statusOptions.find(
                    (option) => option.value === status,
                  )?.label}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="min-w-[230px]">
                    Student
                  </TableHead>

                  <TableHead className="min-w-[220px]">
                    Assignment
                  </TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead className="min-w-[150px]">
                    Submitted
                  </TableHead>

                  <TableHead>PR</TableHead>

                  <TableHead className="text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-40"
                    >
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading submissions...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-48"
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <FileCheck2 className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <p className="font-medium">
                          No submissions found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Try changing your search or status
                          filter.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map(
                    (submission) => (
                      <TableRow
                        key={submission.id}
                        className="group"
                      >
                        {/* Student */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                              {getInitials(
                                submission.user.name,
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {submission.user.name ??
                                  "Unknown student"}
                              </p>

                              <p className="truncate text-xs text-muted-foreground">
                                {submission.user.email ??
                                  "No email"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Assignment */}
                        <TableCell>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {submission.assignment.title}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Lesson{" "}
                              {submission.assignment.lessonId}
                            </p>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <StatusBadge
                            status={submission.status}
                          />
                        </TableCell>

                        {/* Submitted */}
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(
                            submission.submittedAt,
                          )}
                        </TableCell>

                        {/* PR */}
                        <TableCell>
                          <Button
                            // asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                          >
                            <a
                              href={submission.prUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </TableCell>

                        {/* Review */}
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() =>
                              openReviewDialog(
                                submission,
                              )
                            }
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => {
          if (!open) {
            closeReviewDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Review submission
            </DialogTitle>

            <DialogDescription>
              Review the student&apos;s work and update its
              status.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-5">
              {/* Student */}
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-xs font-semibold shadow-sm">
                  {getInitials(
                    selectedSubmission.user.name,
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-medium">
                    {selectedSubmission.user.name ??
                      "Unknown student"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {
                      selectedSubmission.assignment
                        .title
                    }
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Review status
                </label>

                <Select
                  value={reviewStatus}
                  onValueChange={(value) =>
                    setReviewStatus(
                      value as ReviewStatus,
                    )
                  }
                  disabled={reviewing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {reviewOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Review note */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Review note
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    Optional
                  </span>
                </label>

                <Textarea
                  value={reviewNote}
                  onChange={(event) =>
                    setReviewNote(event.target.value)
                  }
                  placeholder="Add feedback for the student..."
                  rows={5}
                  maxLength={2000}
                  disabled={reviewing}
                />

                <p className="text-right text-xs text-muted-foreground">
                  {reviewNote.length}/2000
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeReviewDialog}
              disabled={reviewing}
            >
              Cancel
            </Button>

            <Button
              onClick={submitReview}
              disabled={reviewing}
            >
              {reviewing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save review
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}