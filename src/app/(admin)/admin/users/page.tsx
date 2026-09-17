// src/app/(admin)/admin/users/page.tsx
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { auth } from "@/src/lib/auth";
import { requireRole } from "@/src/lib/require-session";
import { listUsers } from "@/src/backend/admin/user-admin.service";

export default async function AdminUsersPage() {
  const session = await auth();
    const user = requireRole(session, "ADMIN");
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Enrollments</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <Link href={`/admin/users/${u.id}`} className="font-medium hover:underline">
                  {u.name}
                </Link>
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
              </TableCell>
              <TableCell>{u._count.enrollments}</TableCell>
              <TableCell>
                {u.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}