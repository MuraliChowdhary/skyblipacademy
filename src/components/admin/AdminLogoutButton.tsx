"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";


export default function AdminLogoutButton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => signOut({ callbackUrl: "/login" })}
        tooltip="Logout"
        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut />
        <span>Logout</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}