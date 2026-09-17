// src/components/admin/add-lesson-dialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/src/components/ui/dialog";

export function AddLessonDialog({
  moduleId,
  nextOrder,
  parentId = null,
  label = "Add lesson",
}: {
  moduleId: string;
  nextOrder: number;
  parentId?: string | null;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  // Under a parent, a new lesson can only be a TOPIC — the OVERVIEW/STANDALONE
  // choice only makes sense at the top level, so skip the picker entirely.
  const [kind, setKind] = useState<"STANDALONE" | "OVERVIEW">("STANDALONE");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const res = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moduleId,
        title,
        slug,
        order: nextOrder,
        parentId,
        kind: parentId ? "TOPIC" : kind,
      }),
    });
    setLoading(false);
    if ((await res.json()).success) { setOpen(false); setTitle(""); router.refresh(); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="sm"><Plus className="mr-1.5 h-4 w-4" /> {label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{parentId ? "New topic" : "New lesson"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          {!parentId && (
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDALONE">Standalone lesson</SelectItem>
                  <SelectItem value="OVERVIEW">Overview (has topics)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading || !title}>{loading ? "Adding..." : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}