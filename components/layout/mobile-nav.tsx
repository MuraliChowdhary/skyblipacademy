"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/data";

export function MobileNav() {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px]">
          <SheetHeader>
            <SheetTitle className="text-left text-sm font-medium">
              Sky Blip Academy
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-md px-2 py-3 text-base text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
            <Button variant="outline" className="mt-4">
              <Link href="/login">Login / Signup</Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
