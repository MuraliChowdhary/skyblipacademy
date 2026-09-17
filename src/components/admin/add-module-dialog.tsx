// src/components/admin/add-module-dialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/src/components/ui/dialog";

export function AddModuleDialog({ courseId, nextOrder }: { courseId: string; nextOrder: number }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, title, order: nextOrder }),
    });
    setLoading(false);
    if ((await res.json()).success) { setOpen(false); setTitle(""); router.refresh(); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add module</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New module</DialogTitle></DialogHeader>
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading || !title}>{loading ? "Adding..." : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}