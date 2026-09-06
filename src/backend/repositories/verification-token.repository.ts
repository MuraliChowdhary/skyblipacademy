import type { Db } from "@/src/lib/prisma";

export function create(
  db: Db,
  data: { identifier: string; token: string; expires: Date },
) {
  return db.verificationToken.create({ data });
}

export function findByToken(db: Db, token: string) {
  return db.verificationToken.findUnique({ where: { token } });
}

// deleteMany, not delete — idempotent, doesn't throw if nothing matches
// (e.g. calling this twice, or the token was never issued).
export function deleteByIdentifier(db: Db, identifier: string) {
  return db.verificationToken.deleteMany({ where: { identifier } });
}

export function findByIdentifier(
  db: Db,
  identifier: string,
) {
  return db.verificationToken.findFirst({
    where: {
      identifier,
      expires: {
        gt: new Date(),
      },
    },
  });
}

export function deleteByToken(
  db: Db,
  token: string,
) {
  return db.verificationToken.delete({
    where: {
      token,
    },
  });
}
