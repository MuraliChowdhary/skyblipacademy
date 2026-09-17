// src/app/api/admin/courses/route.ts
import { createCourse, listCoursesAdmin } from "@/src/backend/admin/course-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


export const GET = withApiHandler(async () => {
  await requireAdmin(await auth());
  return (await listCoursesAdmin());
});

const createSchema = z.object({
  slug: z.string().min(1), title: z.string().min(1), description: z.string().min(1),
  syllabus: z.string().optional(), priceCents: z.number().int().positive(), currency: z.string().optional(),
});

export const POST = withApiHandler(async (req) => {
  await requireAdmin(await auth());
  const body = createSchema.parse(await req.json());
  return await createCourse(body);
});