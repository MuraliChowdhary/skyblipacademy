import { prisma } from "@/src/lib/prisma";
import { DatabaseUnavailableError } from "./errors";

export async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      ok: true,
    };
  } catch (error) {
    console.error("[DATABASE_HEALTH_ERROR]", error);

    return {
      ok: false,
    };
  }
}


export async function requireDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    console.error("[DATABASE_UNAVAILABLE]", error);

    throw new DatabaseUnavailableError();
  }
}