// src/components/dashboard/topbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { SidebarTrigger } from "@/src/components/ui/sidebar";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { useBreadcrumbContext } from "@/src/context/breadcrumb-context";

function titleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  const last = segments[segments.length - 1] ?? "dashboard";

  return last
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Topbar({
  onSearchClick,
}: {
  onSearchClick: () => void;
}) {
  const pathname = usePathname();
  const { items } = useBreadcrumbContext();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <SidebarTrigger className="-ml-1" />

      <Separator
        orientation="vertical"
        className="h-4"
      />

      {items.length > 0 ? (
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-center gap-1.5"
                >
                  <BreadcrumbItem>
                    {item.href && !isLast ? (
                      <BreadcrumbLink>
                        <Link href={item.href}>
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>
                        {item.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>

                  {!isLast && <BreadcrumbSeparator />}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        <h1 className="text-sm font-medium">
          {titleFromPath(pathname)}
        </h1>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onSearchClick}
        className="ml-auto gap-2 text-muted-foreground"
      >
        <Search className="h-3.5 w-3.5" />

        <span>Search</span>

        <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px]">
          ⌘K
        </kbd>
      </Button>
    </header>
  );
}