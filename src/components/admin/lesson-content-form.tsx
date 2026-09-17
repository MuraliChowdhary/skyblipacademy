// src/components/admin/lesson-content-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { ListEditor } from "@/src/components/admin/list-editor";
import { QuizEditor } from "./quiz-editor";

interface KeyTerm { id: string; term: string; definition: string }
interface Question { id: string; prompt: string; answer: string }

export function LessonContentForm({ lesson }: { lesson: any }) {
  const [notionUrl, setNotionUrl] = useState(lesson.notionUrl ?? "");
  const [contentBody, setContentBody] = useState(lesson.contentBody ?? "");
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ----- Assignment state -----
  const [assignTitle, setAssignTitle] = useState(lesson.assignment?.title ?? "");
  const [assignTier, setAssignTier] = useState(lesson.assignment?.tier ?? "REPO");
  const [assignInstructions, setAssignInstructions] = useState(lesson.assignment?.instructions ?? "");
  const [assignRepoUrl, setAssignRepoUrl] = useState(lesson.assignment?.starterRepoUrl ?? "");
  const [assignSaving, setAssignSaving] = useState(false);
  const [assignSaved, setAssignSaved] = useState(false);

  // ----- Wrap-up state -----
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(lesson.keyTakeaways ?? []);
  const [newTakeaway, setNewTakeaway] = useState("");
  const [takeawaysSaving, setTakeawaysSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notionUrl, contentBody, videoUrl }),
    });
    setSaving(false);
    if ((await res.json()).success) setSaved(true);
  };

  const saveAssignment = async () => {
    setAssignSaving(true);
    setAssignSaved(false);
    const res = await fetch(`/api/admin/lessons/${lesson.id}/assignment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: assignTitle, tier: assignTier, instructions: assignInstructions,
        starterRepoUrl: assignRepoUrl || null,
      }),
    });
    setAssignSaving(false);
    if ((await res.json()).success) setAssignSaved(true);
  };

  const saveTakeaways = async (next: string[]) => {
    setTakeawaysSaving(true);
    const res = await fetch(`/api/admin/lessons/${lesson.id}/key-takeaways`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyTakeaways: next }),
    });
    setTakeawaysSaving(false);
    if ((await res.json()).success) setKeyTakeaways(next);
  };

  const addTakeaway = () => {
    if (!newTakeaway) return;
    const next = [...keyTakeaways, newTakeaway];
    setNewTakeaway("");
    saveTakeaways(next);
  };

  const removeTakeaway = (i: number) => {
    saveTakeaways(keyTakeaways.filter((_, idx) => idx !== i));
  };

  return (
    <Tabs defaultValue="content">
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="video">Video</TabsTrigger>
        <TabsTrigger value="assignment">Assignment</TabsTrigger>
        <TabsTrigger value="wrapup">Wrap-up</TabsTrigger>
      </TabsList>

      {/* ----- Content ----- */}
      <TabsContent value="content" className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label>Notion URL</Label>
          <Input value={notionUrl} onChange={(e) => setNotionUrl(e.target.value)} placeholder="https://notion.so/..." />
        </div>
        <div className="space-y-1.5">
          <Label>Content body (markdown)</Label>
          <Textarea value={contentBody} onChange={(e) => setContentBody(e.target.value)} rows={10} className="font-mono text-sm" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        </div>
      </TabsContent>

      {/* ----- Video ----- */}
      <TabsContent value="video" className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label>Video URL</Label>
          <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://cdn..." />
          <p className="text-xs text-muted-foreground">
            Set this and flip "Video: Live" on the course page for it to appear to students.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        </div>
      </TabsContent>

      {/* ----- Assignment ----- */}
      <TabsContent value="assignment" className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={assignTitle} onChange={(e) => setAssignTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Tier</Label>
          <Select value={assignTier} onValueChange={setAssignTier}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="INLINE">Inline (in-browser exercise)</SelectItem>
              <SelectItem value="REPO">Repo (starter repo, PR submission)</SelectItem>
              <SelectItem value="OPEN_ENDED">Open-ended (spec-only build)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Instructions</Label>
          <Textarea value={assignInstructions} onChange={(e) => setAssignInstructions(e.target.value)} rows={5} />
        </div>
        {assignTier === "REPO" && (
          <div className="space-y-1.5">
            <Label>Starter repo URL</Label>
            <Input value={assignRepoUrl} onChange={(e) => setAssignRepoUrl(e.target.value)} placeholder="https://github.com/..." />
          </div>
        )}
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={saveAssignment} disabled={assignSaving || !assignTitle || !assignInstructions}>
            {assignSaving ? "Saving..." : lesson.assignment ? "Update assignment" : "Create assignment"}
          </Button>
          {assignSaved && <span className="text-sm text-muted-foreground">Saved</span>}
        </div>
      </TabsContent>

      {/* ----- Wrap-up ----- */}
      <TabsContent value="wrapup" className="mt-6 space-y-8">
        <div className="space-y-2">
          <Label>Key takeaways</Label>
          {keyTakeaways.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={t} readOnly className="text-sm" />
              <Button variant="ghost" size="sm" onClick={() => removeTakeaway(i)}>Remove</Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input placeholder="Add a takeaway..." value={newTakeaway} onChange={(e) => setNewTakeaway(e.target.value)} />
            <Button variant="outline" size="sm" onClick={addTakeaway} disabled={takeawaysSaving || !newTakeaway}>Add</Button>
          </div>

          <div className="space-y-2">
          <Label>Quiz</Label>
          <QuizEditor lessonId={lesson.id} initialQuestions={lesson.quizQuestions ?? []} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Key terms</Label>
          <ListEditor
            items={(lesson.wrapUpKeyTerms as any[]).map((t) => ({ id: t.id, primary: t.term, secondary: t.definition }))}
            primaryLabel="Term"
            secondaryLabel="Definition"
            addLabel="Add term"
            onAdd={async (term, definition) => {
              const res = await fetch(`/api/admin/lessons/${lesson.id}/key-terms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ term, definition }),
              });
              const json = await res.json();
              return { id: json.data.id, primary: json.data.term, secondary: json.data.definition };
            }}
            onUpdate={async (id, term, definition) => {
              await fetch(`/api/admin/key-terms/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ term, definition }),
              });
            }}
            onDelete={async (id) => {
              await fetch(`/api/admin/key-terms/${id}`, { method: "DELETE" });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Self-check questions</Label>
          <ListEditor
            items={(lesson.wrapUpQuestions as any[]).map((q) => ({ id: q.id, primary: q.prompt, secondary: q.answer }))}
            primaryLabel="Question"
            secondaryLabel="Answer"
            addLabel="Add question"
            onAdd={async (prompt, answer) => {
              const res = await fetch(`/api/admin/lessons/${lesson.id}/key-questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, answer }),
              });
              const json = await res.json();
              return { id: json.data.id, primary: json.data.prompt, secondary: json.data.answer };
            }}
            onUpdate={async (id, prompt, answer) => {
              await fetch(`/api/admin/key-questions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, answer }),
              });
            }}
            onDelete={async (id) => {
              await fetch(`/api/admin/key-questions/${id}`, { method: "DELETE" });
            }}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}