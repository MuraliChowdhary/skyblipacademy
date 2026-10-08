import { UserRole } from "@/src/generated/prisma";
import type { Db } from "@/src/lib/prisma";

export const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  emailVerified: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function findByEmail(
  db: Db,
  email: string,
) {
  return db.user.findUnique({
    where: { email },
  });
}

export function findByIdWithPasswordHash(
  db: Db,
  id: string,
) {
  return db.user.findUnique({
    where: { id },
  });
}

export function findById(
  db: Db,
  id: string,
) {
  return db.user.findUnique({
    where: { id },
    select: PUBLIC_USER_SELECT,
  });
}

export function updateName(
  db: Db,
  id: string,
  name: string,
) {
  return db.user.update({
    where: { id },
    data: { name },
    select: PUBLIC_USER_SELECT,
  });
}

export function updatePhone(
  db: Db,
  id: string,
  phone: string,
) {
  return db.user.update({
    where: { id },
    data: { phone },
    select: PUBLIC_USER_SELECT,
  });
}

export function updatePasswordHash(
  db: Db,
  id: string,
  passwordHash: string,
) {
  return db.user.update({
    where: { id },
    data: { passwordHash },
  });
}

export function updateEmail(
  db: Db,
  id: string,
  email: string,
) {
  return db.user.update({
    where: { id },
    data: {
      email,
      emailVerified: new Date(),
    },
    select: PUBLIC_USER_SELECT,
  });
}

export function create(
  db: Db,
  data: {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    role:UserRole
  },
) {
  return db.user.create({
    data,
    select: PUBLIC_USER_SELECT,
  });
}

export function deleteById(
  db: Db,
  id: string,
) {
  return db.user.delete({
    where: { id },
  });
}