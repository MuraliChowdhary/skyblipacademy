import { z } from "zod";

export const createCourseSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  priceCents: z.number().int().positive(),
  currency: z.string().trim().length(3).default("INR"),
  isPublished: z.boolean().default(false),
});
export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required.",
  });
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
