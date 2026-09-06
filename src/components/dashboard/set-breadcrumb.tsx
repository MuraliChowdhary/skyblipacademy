// src/components/dashboard/set-breadcrumb.tsx
"use client";

import { useEffect } from "react";
import { useBreadcrumbContext, type BreadcrumbItem } from "@/src/context/breadcrumb-context";

// A server component page can't call context directly, so it renders this
// tiny client component with the trail as props — this is the only place
// a page touches breadcrumbs. No page ever renders <Breadcrumb> itself.
export function SetBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const { setItems } = useBreadcrumbContext();

  useEffect(() => {
    setItems(items);
    return () => setItems([]); // clear on navigation away, so a stale trail never lingers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

  return null;
}