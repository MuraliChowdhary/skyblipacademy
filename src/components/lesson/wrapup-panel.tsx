// src/components/lesson/wrapup-panel.tsx
"use client";

import { useState } from "react";
import { Badge } from "@/src/components/ui/badge";

interface WrapUp {
  keyTakeaways: string[];
  keyTerms: { term: string; definition: string }[];
  questions: { id: string; prompt: string; answer: string }[];
}

export function WrapUpPanel({ wrapUp }: { wrapUp: WrapUp }) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const hasContent =
    wrapUp.keyTakeaways.length || wrapUp.keyTerms.length || wrapUp.questions.length;

  if (!hasContent) {
    return <p className="text-sm text-muted-foreground">Wrap-up for this lesson is coming soon.</p>;
  }

  return (
    <div className="space-y-8">
      {wrapUp.keyTakeaways.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">What you should be able to do now</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {wrapUp.keyTakeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {wrapUp.keyTerms.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Key terms</h3>
          <dl className="space-y-2 rounded-lg border p-4">
            {wrapUp.keyTerms.map((kt) => (
              <div key={kt.term} className="text-sm">
                <dt className="font-medium">{kt.term}</dt>
                <dd className="text-muted-foreground">{kt.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {wrapUp.questions.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Check yourself</h3>
          {wrapUp.questions.map((q) => (
            <div key={q.id} className="rounded-lg border p-4">
              <p className="text-sm font-medium">{q.prompt}</p>
              {revealed.has(q.id) ? (
                <p className="mt-2 text-sm text-muted-foreground">{q.answer}</p>
              ) : (
                <button
                  onClick={() => toggle(q.id)}
                  className="mt-2 text-sm text-primary underline-offset-2 hover:underline"
                >
                  Reveal answer
                </button>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}