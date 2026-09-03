"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { MobileNav } from "@/src/components/layout/mobile-nav";
import { NAV_LINKS } from "@/src/lib/data";
import { cn } from "@/src/lib/utils";
import { useCurrentUser } from "@/src/hooks/session";

export function SiteHeader() {
  const pathname = usePathname();
const { user, isLoading, isAuthenticated } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          </span>
          <span className="text-[15px] font-medium tracking-tight">
            Sky Blip <span className="text-muted-foreground">Academy</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

       <div className="hidden items-center gap-3 lg:flex"> 
        {isLoading ? ( <div className="h-10 w-28 animate-pulse rounded-md bg-muted" /> ) : 
        isAuthenticated ? ( <> <span className="text-sm"> {user?.name ?? user?.email} </span> 
        <Button size="lg"> <Link href="/dashboard"> Dashboard </Link>
         </Button> </> ) : ( 
          <Button size="lg"> <Link href="/login"> Login / Signup </Link> </Button> )} 
       </div>

        <MobileNav />
      </div>
    </header>
  );
}
