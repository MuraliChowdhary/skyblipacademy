"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";

import {
  navItems,
  ADMIN_NAV,
} from "@/src/components/layout/nav-config";

type Role = "STUDENT" | "ADMIN";

export function CommandMenu({
  role,
  open,
  onOpenChange,
}: {
  role: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const items = role === "ADMIN" ? ADMIN_NAV : navItems;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <Command>
        <CommandInput placeholder="Jump to a page..." />

        <CommandList>
          <CommandEmpty>
            No results found.
          </CommandEmpty>

          <CommandGroup heading="Navigate">
            {items.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => go(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}