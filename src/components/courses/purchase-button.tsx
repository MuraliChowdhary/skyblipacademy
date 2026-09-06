// src/components/courses/purchase-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";

export function PurchaseButton({ courseId, priceCents }: { courseId: string; priceCents: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const buy = async () => {
    setLoading(true);
    const res = await fetch(`/api/courses/${courseId}/purchase`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
    });
    const json = await res.json();
    setLoading(false);
    if (json.success) {
      // Your checkout/payment step goes here (Razorpay flow) before
      // redirecting — this assumes that's handled elsewhere and the
      // order is confirmed; adjust once the payment UI is wired in.
      router.push(`/courses/${courseId}`);
      router.refresh();
    }
  };

  return (
    <Button onClick={buy} disabled={loading}>
      {loading ? "Processing..." : `Buy — ₹${(priceCents / 100).toFixed(0)}`}
    </Button>
  );
}