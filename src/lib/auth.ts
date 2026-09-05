import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { loginSchema } from "../schema/auth.schema";
import { logger } from "./logger";
import {
  findUserByEmail,
  verifyPassword,
} from "../backend/services/user.service";

type Role = "STUDENT" | "ADMIN";

class DatabaseUnavailableError extends CredentialsSignin {
  code = "DATABASE_UNAVAILABLE";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        let user;

        try {
          user = await findUserByEmail(parsed.data.email);
        } catch (error) {
          logger.error(
            { err: error },
            "auth.login.database_unavailable",
          );

          throw new DatabaseUnavailableError();
        }

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );

        if (!valid) {
          logger.warn(
            { userId: user.id },
            "auth.login.invalid_password",
          );

          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }

      return session;
    },
  },
});