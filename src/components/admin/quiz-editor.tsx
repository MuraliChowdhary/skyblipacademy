// src/components/admin/quiz-editor.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Badge } from "@/src/components/ui/badge";

interface Option { id: string; text: string }
interface QuizQuestion {
  id: string; prompt: string; options: Option[]; correctOptionId: string;
  explanation: string; hint: string | null;
}

const blankOptions = (): Option[] => [{ id: "a", text: "" }, { id: "b", text: "" }];

function QuestionForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: QuizQuestion;
  onSave: (q: Omit<QuizQuestion, "id">) => Promise<void>;
  onCancel: () => void;
}) {
  const [prompt, setPrompt] = useState(initial?.prompt ?? "");
  const [options, setOptions] = useState<Option[]>(initial?.options ?? blankOptions());
  const [correctOptionId, setCorrectOptionId] = useState(initial?.correctOptionId ?? "a");
  const [explanation, setExplanation] = useState(initial?.explanation ?? "");
  const [hint, setHint] = useState(initial?.hint ?? "");
  const [saving, setSaving] = useState(false);

  const updateOption = (id: string, text: string) =>
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));

  const addOption = () => {
    if (options.length >= 6) return;
    const nextId = String.fromCharCode(97 + options.length); // a, b, c, ...
    setOptions((prev) => [...prev, { id: nextId, text: "" }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return; // never below 2 choices
    setOptions((prev) => prev.filter((o) => o.id !== id));
    if (correctOptionId === id) setCorrectOptionId(options[0].id);
  };

  const valid = prompt && explanation && options.every((o) => o.text) && correctOptionId;

  const save = async () => {
    setSaving(true);
    await onSave({ prompt, options, correctOptionId, explanation, hint: hint || null });
    setSaving(false);
  };

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="space-y-1.5">
        <Label>Question</Label>
        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2} />
      </div>

      <div className="space-y-2">
        <Label>Options — select the correct one</Label>
        <RadioGroup value={correctOptionId} onValueChange={setCorrectOptionId}>
          {options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <RadioGroupItem value={opt.id} id={`opt-${opt.id}`} />
              <Input value={opt.text} onChange={(e) => updateOption(opt.id, e.target.value)} placeholder={`Option ${opt.id.toUpperCase()}`} />
              {options.length > 2 && (
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeOption(opt.id)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </RadioGroup>
        {options.length < 6 && (
          <Button variant="outline" size="sm" onClick={addOption}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add option
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Explanation (shown after answering)</Label>
        <Textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} />
      </div>

      <div className="space-y-1.5">
        <Label>Hint (optional)</Label>
        <Input value={hint} onChange={(e) => setHint(e.target.value)} />
      </div>

      <div className="flex gap-2 pt-1">
        <Button size="sm" onClick={save} disabled={!valid || saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

export function QuizEditor({ lessonId, initialQuestions }: { lessonId: string; initialQuestions: QuizQuestion[] }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const create = async (q: Omit<QuizQuestion, "id">) => {
    const res = await fetch(`/api/admin/lessons/${lessonId}/quiz-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q),
    });
    const json = await res.json();
    if (json.success) {
      setQuestions((prev) => [...prev, json.data]);
      setAdding(false);
    }
  };

  const update = async (id: string, q: Omit<QuizQuestion, "id">) => {
    const res = await fetch(`/api/admin/quiz-questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q),
    });
    const json = await res.json();
    if (json.success) {
      setQuestions((prev) => prev.map((existing) => (existing.id === id ? json.data : existing)));
      setEditingId(null);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/quiz-questions/${id}`, { method: "DELETE" });
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-3">
      {questions.map((q) =>
        editingId === q.id ? (
          <QuestionForm key={q.id} initial={q} onSave={(data) => update(q.id, data)} onCancel={() => setEditingId(null)} />
        ) : (
          <div key={q.id} className="space-y-2 rounded-lg border p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{q.prompt}</p>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(q.id)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(q.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              {q.options.map((o) => (
                <div key={o.id} className="flex items-center gap-2 text-sm">
                  {o.id === q.correctOptionId ? (
                    <Badge className="h-5 px-1.5 text-[10px]">Correct</Badge>
                  ) : (
                    <span className="w-[52px]" />
                  )}
                  {o.text}
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {adding ? (
        <QuestionForm onSave={create} onCancel={() => setAdding(false)} />
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Add quiz question
        </Button>
      )}
    </div>
  );
}