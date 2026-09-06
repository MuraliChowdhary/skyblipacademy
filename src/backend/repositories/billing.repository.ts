import type { Db } from "@/src/lib/prisma";

const BILLING_SELECT = {
  id: true,
  fullName: true,
  country: true,
  state: true,
  address: true,
  city: true,
  postalCode: true,
  taxId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function findByUserId(
  db: Db,
  userId: string,
) {
  return db.billingProfile.findUnique({
    where: {
      userId,
    },
    select: BILLING_SELECT,
  });
}

export function upsert(
  db: Db,
  userId: string,
  data: {
    fullName?: string;
    country: string;
    state?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    taxId?: string;
  },
) {
  return db.billingProfile.upsert({
    where: {
      userId,
    },

    create: {
      userId,
      ...data,
    },

    update: {
      ...data,
    },

    select: BILLING_SELECT,
  });
}