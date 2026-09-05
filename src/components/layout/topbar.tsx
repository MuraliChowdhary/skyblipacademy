"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/src/components/ui/sidebar";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";

function titleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] ?? "dashboard";
  return last.charAt(0).toUpperCase() + last.slice(1);
}

export function Topbar({ onSearchClick }: { onSearchClick: () => void }) {
  const pathname = usePathname();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <h1 className="text-sm font-medium">{titleFromPath(pathname)}</h1>

      <Button
        variant="outline"
        size="sm"
        onClick={onSearchClick}
        className="ml-auto gap-2 text-muted-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        Search
        <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </Button>
    </header>
  );
}
