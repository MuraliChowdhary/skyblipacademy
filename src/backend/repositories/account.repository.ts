import type { Db } from "@/src/lib/prisma";

const CONNECTED_ACCOUNT_SELECT = {
  id: true,
  provider: true,
  type: true,
} as const;

export function findByUserId(
  db: Db,
  userId: string,
) {
  return db.account.findMany({
    where: {
      userId,
    },
    select: CONNECTED_ACCOUNT_SELECT,
    orderBy: {
      provider: "asc",
    },
  });
}

export function findById(
  db: Db,
  id: string,
) {
  return db.account.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      provider: true,
      type: true,
    },
  });
}

export function deleteById(
  db: Db,
  id: string,
) {
  return db.account.delete({
    where: { id },
  });
}