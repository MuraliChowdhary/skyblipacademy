// src/app/api/admin/modules/route.ts
import { createModule } from "@/src/backend/admin/course-admin.service";
import { withApiHandler } from "@/src/lib/api-handler";
import { auth } from "@/src/lib/auth";
import { requireAdmin } from "@/src/lib/require-admin";
import { z } from "zod";


const bodySchema = z.object({ courseId: z.string(), title: z.string().min(1), order: z.number().int() });

export const POST = withApiHandler(async (req) => {
  await requireAdmin(await auth());
  const body = bodySchema.parse(await req.json());
  return await createModule(body.courseId, { title: body.title, order: body.order });
});