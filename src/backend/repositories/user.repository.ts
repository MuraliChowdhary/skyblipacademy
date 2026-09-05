import type { Db } from "@/src/lib/prisma";

// Full model, including passwordHash — this is for internal auth checks
// only (see lib/auth.ts via user.service.ts) and must never be returned
// as-is from an API route.
export function findByEmail(db: Db, email: string) {
  return db.user.findUnique({ where: { email } });
}

// Same as findByEmail's note: internal use only (password-change flow),
// never returned as-is.
export function findByIdWithPasswordHash(db: Db, id: string) {
  return db.user.findUnique({ where: { id } });
}

const PUBLIC_SELECT = {
  id: true,
  name: true,
  email: true,
  phone:true,
  role: true,
  createdAt: true,
} as const;

export function findById(db: Db, id: string) {
  return db.user.findUnique({ where: { id }, select: PUBLIC_SELECT });
}

export function updateName(db: Db, id: string, name: string) {
  return db.user.update({ where: { id }, data: { name }, select: PUBLIC_SELECT });
}

export function updatePasswordHash(db: Db, id: string, passwordHash: string) {
  return db.user.update({ where: { id }, data: { passwordHash } });
}

export function create(
  db: Db,
  data: { name: string; email: string; passwordHash: string, phone: string},
) {
  return db.user.create({
    data,
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });
}
