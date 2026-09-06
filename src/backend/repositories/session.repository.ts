import type { Db } from "@/src/lib/prisma";

const SESSION_SELECT = {
  id: true,
  expires: true,
} as const;

export function findByUserId(
  db: Db,
  userId: string,
) {
  return db.session.findMany({
    where: {
      userId,
      expires: {
        gt: new Date(),
      },
    },
    select: SESSION_SELECT,
    orderBy: {
      expires: "desc",
    },
  });
}

export function findById(
  db: Db,
  id: string,
) {
  return db.session.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      expires: true,
    },
  });
}

export function deleteById(
  db: Db,
  id: string,
) {
  return db.session.delete({
    where: { id },
  });
}

export function deleteOtherSessions(
  db: Db,
  userId: string,
  currentSessionId: string,
) {
  return db.session.deleteMany({
    where: {
      userId,
      id: {
        not: currentSessionId,
      },
    },
  });
}

export function deleteAllByUserId(
  db: Db,
  userId: string,
) {
  return db.session.deleteMany({
    where: { userId },
  });
}