"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type { LessonNav } from "@/src/components/layout/topbar";

const LessonNavigationContext =
  createContext<LessonNav | null>(null);

export function LessonNavigationProvider({
  nav,
  children,
}: {
  nav: LessonNav | null;
  children: ReactNode;
}) {
  return (
    <LessonNavigationContext.Provider value={nav}>
      {children}
    </LessonNavigationContext.Provider>
  );
}

export function useLessonNavigation() {
  return useContext(LessonNavigationContext);
}