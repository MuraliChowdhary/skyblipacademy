import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { loginSchema } from "../schema/auth.schema";
import { logger } from "./logger";
import { verifyPassword } from "../backend/services/user.service";
import { AppError } from "./errors";

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.passwordHash) return null;

        const valid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!valid) {
          logger.warn({ userId: user.id }, "auth.login.invalid_password");
          throw new AppError("INVALID_PASSWORD","Invalid Credentials.",400);
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],

    callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});