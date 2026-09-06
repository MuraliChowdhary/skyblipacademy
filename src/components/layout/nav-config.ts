import {
  Home,
  GraduationCap,
  Receipt,
  UserCircle,
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  // title: string;
  href: string;
  icon: LucideIcon;
  label:string;
};

import {
  PlayCircle,
  Bookmark,
  History,
  User,
} from "lucide-react";

export const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "My Courses", href: "/dashboard/my-learning", icon: BookOpen },
  { label: "Continue Learning", href: "/dashboard/continue", icon: PlayCircle },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Purchases", href: "/dashboard/purchases", icon: Receipt },
  { label: "Account", href: "/dashboard/account", icon: User },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Transactions", href: "/admin/orders", icon: CreditCard },
  { label: "Learners", href: "/admin/users", icon: Users },
];
