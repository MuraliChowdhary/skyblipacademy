"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PRIMARY_CTA } from "@/src/lib/data";

export function StickyMentorBar() {
  return (
    <div className="fixed bottom-5 left-5 z-40 hidden sm:block">
      <Link
        href="/cohort"
        className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium shadow-lg shadow-black/5 transition-colors hover:bg-secondary"
      >
        <MessageCircle className="h-4 w-4" />
        {PRIMARY_CTA}
      </Link>
    </div>
  );
}
