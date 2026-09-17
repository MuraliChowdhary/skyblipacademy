// src/components/admin/list-editor.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";

interface Item {
  id: string;
  primary: string;   // term / prompt
  secondary: string; // definition / answer
}

export function ListEditor({
  items: initialItems,
  primaryLabel,
  secondaryLabel,
  addLabel,
  onAdd,
  onUpdate,
  onDelete,
}: {
  items: Item[];
  primaryLabel: string;
  secondaryLabel: string;
  addLabel: string;
  onAdd: (primary: string, secondary: string) => Promise<Item>;
  onUpdate: (id: string, primary: string, secondary: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [items, setItems] = useState(initialItems);
  const [newPrimary, setNewPrimary] = useState("");
  const [newSecondary, setNewSecondary] = useState("");
  const [adding, setAdding] = useState(false);

  const add = async () => {
    if (!newPrimary || !newSecondary) return;
    setAdding(true);
    const created = await onAdd(newPrimary, newSecondary);
    setItems((prev) => [...prev, created]);
    setNewPrimary("");
    setNewSecondary("");
    setAdding(false);
  };

  const remove = async (id: string) => {
    await onDelete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const editItem = async (id: string, primary: string, secondary: string) => {
    await onUpdate(id, primary, secondary);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, primary, secondary } : i)));
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="space-y-2 rounded-lg border p-3">
          <div className="flex items-start gap-2">
            <Input
              defaultValue={item.primary}
              onBlur={(e) => e.target.value !== item.primary && editItem(item.id, e.target.value, item.secondary)}
            />
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => remove(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            defaultValue={item.secondary}
            rows={2}
            onBlur={(e) => e.target.value !== item.secondary && editItem(item.id, item.primary, e.target.value)}
          />
        </div>
      ))}

      <div className="space-y-2 rounded-lg border border-dashed p-3">
        <Input placeholder={primaryLabel} value={newPrimary} onChange={(e) => setNewPrimary(e.target.value)} />
        <Textarea placeholder={secondaryLabel} rows={2} value={newSecondary} onChange={(e) => setNewSecondary(e.target.value)} />
        <Button size="sm" variant="outline" onClick={add} disabled={adding || !newPrimary || !newSecondary}>
          <Plus className="mr-1.5 h-4 w-4" /> {addLabel}
        </Button>
      </div>
    </div>
  );
}