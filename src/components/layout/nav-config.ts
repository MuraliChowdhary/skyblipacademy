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
  title: string;
  href: string;
  icon: LucideIcon;
};

export const STUDENT_NAV: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "My Learning", href: "/dashboard/courses", icon: GraduationCap },
  { title: "Purchases", href: "/dashboard/orders", icon: Receipt },
  { title: "Account", href: "/dashboard/profile", icon: UserCircle },
];

export const ADMIN_NAV: NavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Transactions", href: "/admin/orders", icon: CreditCard },
  { title: "Learners", href: "/admin/users", icon: Users },
];
