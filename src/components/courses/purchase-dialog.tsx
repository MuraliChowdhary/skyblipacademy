// src/components/courses/purchase-dialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "../ui/toast";

interface BillingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function PurchaseDialog({
  courseId,
  courseTitle,
  priceCents,
}: {
  courseId: string;
  courseTitle: string;
  priceCents: number;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billing, setBilling] = useState<BillingDetails>({ name: "", email: "", phone: "", address: "" });
  const router = useRouter();

  const update = (field: keyof BillingDetails) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setBilling((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async () => {
    if (!billing.name || !billing.email || !billing.phone) {
      setError("Name, email, and phone are required.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/courses/${courseId}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ billing }),
    });
    const json = await res.json();
    setLoading(false);

    if (!json.success) {
      setError(json.error.message);
      return;
    }

    // json.data.order.id now exists — this is where a real payment provider
    // (Razorpay) checkout opens using that order id. Until that's wired in,
    // this goes straight to the dev confirm endpoint for testing.
    setOpen(false);

    toast.add({
  title: "Purchase details saved",
  description:
    "Your billing details were saved and your order was created successfully. Continue to payment to complete your purchase.",
});

    router.push(`/courses/${courseId}`);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button>Buy — ₹{(priceCents / 100).toFixed(0)}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Billing details</DialogTitle>
          <p className="text-sm text-muted-foreground">For your purchase of &quot;{courseTitle}&quot;</p>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={billing.name} onChange={update("name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={billing.email} onChange={update("email")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={billing.phone} onChange={update("phone")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Billing address</Label>
            <Input id="address" value={billing.address} onChange={update("address")} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Processing..." : "Continue to payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}