import { Prisma } from "@/src/generated/prisma/client";

export function isDatabaseError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return true;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return true;
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    return (
      message.includes("timeout") ||
      message.includes("timed out") ||
      message.includes("connection") ||
      message.includes("connect") ||
      message.includes("econnrefused") ||
      message.includes("etimedout") ||
      message.includes("enotfound")
    );
  }

  return false;
}