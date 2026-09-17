// src/app/(admin)/admin/courses/page.tsx
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { NewCourseDialog } from "@/src/components/admin/new-course-dialog";
import { auth } from "@/src/lib/auth";
import { requireRole } from "@/src/lib/require-session";
import { listCoursesAdmin } from "@/src/backend/admin/course-admin.service";

export default async function AdminCoursesPage() {
  const session = await auth();
    const user = requireRole(session, "ADMIN");
  const courses = await listCoursesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Courses</h1>
        <NewCourseDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Enrollments</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Link href={`/admin/courses/${c.id}`} className="font-medium hover:underline">
                  {c.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={c.isPublished ? "default" : "secondary"}>
                  {c.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>{c._count.enrollments}</TableCell>
              <TableCell>{c._count.orders}</TableCell>
              <TableCell>₹{(c.priceCents / 100).toFixed(0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}