

// Deliberately not filtered by isPublished — the caller (enrollment
// service) needs to distinguish "course doesn't exist" from "course

import { Prisma } from "@/src/generated/prisma";
import { Db } from "@/src/lib/prisma";

// exists but isn't for sale," which are different errors to the user.
export function findById(db: Db, id: string) {
  return db.course.findUniqueOrThrow({ where: { id } });
}

export function findManyPublished(db: Db) {
  return db.course.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      priceCents: true,
      currency: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

export function create(db: Db, data: Prisma.CourseCreateInput) {
  return db.course.create({ data });
}

// No hard delete on purpose — a real delete would orphan any existing
// Order/Enrollment rows that reference this course. "Deleting" a course
// is always an update to isPublished: false.
export function update(db: Db, id: string, data: Prisma.CourseUpdateInput) {
  return db.course.update({ where: { id }, data });
}
