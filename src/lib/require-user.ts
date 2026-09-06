import { auth } from "@/src/lib/auth";
import { Errors } from "./app-error";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw Errors.unauthorized();
  return session.user.id;
}