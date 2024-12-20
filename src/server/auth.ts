import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type User as DBUser } from "@prisma/client";
import {
  type NextApiRequest,
  type GetServerSidePropsContext,
  type NextApiResponse,
} from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GithubProvider, { type GithubProfile } from "next-auth/providers/github";
import { getSession } from "next-auth/react";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: 'USER'|'ADMIN';
    };
  }

  /**
   *
   *  User Inside the Next-Auth Coming from DB */
  interface User extends Partial<DBUser> {}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "database" },
  callbacks: {
    session: ({ session, user }) => ({
      // here default session only has default session user value (name, email, image)
      // so to add further values like (id, and role) we have to add them
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      profile(profile: GithubProfile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          image: profile.avatar_url,
          email: profile.email,
          role: profile.email === env.ADMIN ? "ADMIN" : "USER",
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getSession`.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getSessionSSR = (req: GetServerSidePropsContext["req"]) => {
  return getSession({ req });
};

/**
 * Wrapper for `getSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
