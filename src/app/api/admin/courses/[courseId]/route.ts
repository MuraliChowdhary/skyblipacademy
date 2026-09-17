// src/app/api/admin/courses/[courseId]/route.ts
import { z } from "zod";

import { withApiHandler } from "@/src/lib/api-handler";
import { requireAdmin } from "@/src/lib/require-admin";
import { updateCourse } from "@/src/backend/admin/course-admin.service";
import { auth } from "@/src/lib/auth";
import { updateCourseSchema } from "@/src/schema/course.schema";

const updateSchema = z.object({
  title: z.string().optional(), description: z.string().optional(), syllabus: z.string().optional(),
  priceCents: z.number().int().positive().optional(), isPublished: z.boolean().optional(),
});

export const PATCH = withApiHandler<{ courseId: string }>(async (req, { params }) => {
  await requireAdmin(await auth());
  const body = updateCourseSchema.parse(await req.json());
  const {courseId} = await params;
  return await updateCourse(courseId, body);
});