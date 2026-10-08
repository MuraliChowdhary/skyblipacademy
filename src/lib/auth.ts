// Pre-computed argon2id hash to ensure constant-time response and prevent user enumeration
// const DUMMY_HASH =
//   "$argon2id$v=19$m=65536,p=4,t=3$a62frcMSwiOwKj5wCxl7SA$DIdDEqj8HVcd8prnjUihQG9RATnsH4xnS8ZjFzpiWi8";
import dotenv from "dotenv";
dotenv.config();
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { loginSchema } from "../schema/auth.schema";
import { logger } from "./logger";
import {
  findUserByEmail,
  verifyPassword,
} from "../backend/services/user.service";

const DUMMY_HASH = process.env.DUMMY_HASH as string;

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

        const passwordHash = user?.passwordHash ?? DUMMY_HASH;
        const valid = await verifyPassword(
          parsed.data.password,
          passwordHash,
        );

        if (!user || !user.passwordHash || !valid) {
          if (user) {
            logger.warn(
              { userId: user.id },
              "auth.login.invalid_password",
            );
          }

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