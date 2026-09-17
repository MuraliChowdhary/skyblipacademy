// src/components/admin/lesson-actions-menu.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreVertical, Pencil, Trash2, FileEdit } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/src/components/ui/alert-dialog";

export function LessonActionsMenu({ lessonId, title }: { lessonId: string; title: string }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveEdit = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/lessons/${lessonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    setLoading(false);
    if ((await res.json()).success) { setEditOpen(false); router.refresh(); }
  };

  const confirmDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
    const json = await res.json();
    setLoading(false);
    if (!json.success) return setError(json.error.message);
    setDeleteOpen(false);
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`/admin/lessons/${lessonId}`}><FileEdit className="mr-2 h-4 w-4" /> Edit content</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename lesson</DialogTitle></DialogHeader>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={loading || !newTitle}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              {error ?? "This also removes its assignment, wrap-up content, and any topics under it — this can't be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={loading}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}