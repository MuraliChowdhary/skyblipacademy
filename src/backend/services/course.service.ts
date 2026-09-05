import { prisma } from "@/src/lib/prisma";
import { AppError, isUniqueConstraintError, isRecordNotFoundError } from "@/src/lib/errors";
import * as courseRepository from "@/src/backend/repositories/course.repository";
import { createCourseSchema, updateCourseSchema } from "@/src/schema/course.schema";

export async function listPublishedCourses() {
  return courseRepository.findManyPublished(prisma);
}

/**
 * An unpublished course returns NOT_FOUND to anyone who isn't an admin —
 * same status a genuinely nonexistent id would return. Returning 403
 * ("exists but you can't see it") would confirm the id is real, which
 * is exactly the kind of thing an unpublished/draft course shouldn't
 * leak before it's ready.
 */
export async function getCourseDetail(courseId: string, role: string | undefined) {
  try {
    const course = await courseRepository.findById(prisma, courseId);
    if (!course.isPublished && role !== "ADMIN") {
      throw new AppError("NOT_FOUND", "Course not found.", 404);
    }
    return course;
  } catch (err) {
    if (isRecordNotFoundError(err)) {
      throw new AppError("NOT_FOUND", "Course not found.", 404);
    }
    throw err;
  }
}

export async function createCourse(input: unknown) {
  const data = createCourseSchema.parse(input);
  try {
    return await courseRepository.create(prisma, data);
  } catch (err) {
    if (isUniqueConstraintError(err, "slug")) {
      throw new AppError("SLUG_TAKEN", "A course with this slug already exists.", 409);
    }
    throw err;
  }
}

export async function updateCourse(courseId: string, input: unknown) {
  const data = updateCourseSchema.parse(input);
  try {
    return await courseRepository.update(prisma, courseId, data);
  } catch (err) {
    if (isUniqueConstraintError(err, "slug")) {
      throw new AppError("SLUG_TAKEN", "A course with this slug already exists.", 409);
    }
    if (isRecordNotFoundError(err)) {
      throw new AppError("NOT_FOUND", "Course not found.", 404);
    }
    throw err;
  }
}

// "Delete" = unpublish. See course.repository's comment on why there's
// no hard delete.
export async function unpublishCourse(courseId: string) {
  try {
    return await courseRepository.update(prisma, courseId, { isPublished: false });
  } catch (err) {
    if (isRecordNotFoundError(err)) {
      throw new AppError("NOT_FOUND", "Course not found.", 404);
    }
    throw err;
  }
}
