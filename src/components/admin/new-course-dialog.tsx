// src/components/admin/new-course-dialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/src/components/ui/dialog";

export function NewCourseDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ slug: "", title: "", description: "", priceCents: "" });
  const router = useRouter();

  const submit = async () => {
    setError(null);
    if (!form.slug || !form.title || !form.description || !form.priceCents) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, priceCents: Math.round(Number(form.priceCents) * 100) }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) return setError(json.error.message);
    setOpen(false);
    router.push(`/admin/courses/${json.data.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New course</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="fullstack-mern-ai" />
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Price (₹)</Label>
            <Input type="number" value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: e.target.value })} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}