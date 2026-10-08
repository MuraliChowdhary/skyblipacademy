"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Menu } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { NAV_LINKS } from "@/src/lib/data";
import { useCurrentUser } from "@/src/hooks/session";

export function MobileNav() {
  const router = useRouter();
  const { user, isAuthenticated } = useCurrentUser();

  async function handleDashboardRedirect() {
    const session = await getSession();

    if (session?.user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }

    router.refresh();
  }

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
            {isAuthenticated ? (
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={handleDashboardRedirect}
              >
                {user?.role === "ADMIN" ? "Admin" : "Dashboard"}
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="mt-4 w-full">
                  Login / Signup
                </Button>
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
