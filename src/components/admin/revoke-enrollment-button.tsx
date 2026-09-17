// src/components/admin/revoke-enrollment-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";

export function RevokeEnrollmentButton({ userId, courseId }: { userId: string; courseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const revoke = async () => {
    setLoading(true);
    await fetch(`/api/admin/users/${userId}/enrollments/${courseId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return <Button size="sm" variant="ghost" onClick={revoke} disabled={loading}>Revoke</Button>;
}