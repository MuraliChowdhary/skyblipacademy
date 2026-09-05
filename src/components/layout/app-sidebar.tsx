"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Radio } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/src/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { STUDENT_NAV, ADMIN_NAV } from "@/src/components/layout/nav-config";
import { useCurrentUser } from "@/src/hooks/session";
import { Button } from "@base-ui/react";

type Role = "STUDENT" | "ADMIN";

export function AppSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const items = role === "ADMIN" ? ADMIN_NAV : STUDENT_NAV;

  const initials = (user?.name ?? "SB")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sidebar-border">
            <Radio className="h-3.5 w-3.5 text-sidebar-primary" />
          </span>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">Sky Blip</span>
            <span className="text-xs text-sidebar-foreground/60">
              {role === "ADMIN" ? "Admin console" : "Learning hub"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === "ADMIN" ? "Manage" : "Navigate"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <div className="flex gap-2">
                        <item.icon />
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        <Button>{item.title}</Button>
                      </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Sign out"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
              </Avatar>
              <span className="truncate">{user?.name ?? "Account"}</span>
              <LogOut className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}