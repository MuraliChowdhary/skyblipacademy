// src/components/lesson/quiz-panel.tsx
"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface QuizQuestion {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  hint: string | null;
}

function Question({ q }: { q: QuizQuestion }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = checked && selected === q.correctOptionId;

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-medium">{q.prompt}</p>

      <RadioGroup value={selected ?? undefined} onValueChange={setSelected} disabled={checked}>
        {q.options.map((opt) => (
          <div key={opt.id} className="flex items-center gap-2">
            <RadioGroupItem value={opt.id} id={`${q.id}-${opt.id}`} />
            <Label htmlFor={`${q.id}-${opt.id}`} className="text-sm font-normal">{opt.text}</Label>
          </div>
        ))}
      </RadioGroup>

      {!checked && q.hint && (
        <button onClick={() => setShowHint((s) => !s)} className="flex items-center gap-1 text-xs text-muted-foreground hover:underline">
          <Lightbulb className="h-3 w-3" /> {showHint ? "Hide hint" : "Show hint"}
        </button>
      )}
      {showHint && !checked && <p className="text-xs text-muted-foreground">{q.hint}</p>}

      {!checked ? (
        <Button size="sm" onClick={() => setChecked(true)} disabled={!selected}>Check</Button>
      ) : (
        <div className="space-y-1.5">
          <Badge variant={isCorrect ? "default" : "destructive"} className="gap-1">
            {isCorrect ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {isCorrect ? "Correct" : "Not quite"}
          </Badge>
          <p className="text-sm text-muted-foreground">{q.explanation}</p>
        </div>
      )}
    </div>
  );
}

export function QuizPanel({ questions }: { questions: QuizQuestion[] }) {
  if (questions.length === 0) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Quiz</h3>
      {questions.map((q) => <Question key={q.id} q={q} />)}
    </div>
  );
}