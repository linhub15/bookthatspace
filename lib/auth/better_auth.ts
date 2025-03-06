import {
  account,
  session,
  user as User,
  verification,
} from "@/app/db/auth_schema";
import { db } from "@/app/db/database";
import { profile } from "@/app/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: User,
      session,
      account,
      verification,
    },
  }),
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    cookiePrefix: "bts",
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const inserted = await db
            .insert(profile)
            .values({ userId: user.id })
            .returning();

          if (!inserted) {
            throw new Error(`Failed to insert profile for user:${user.id}`);
          }
        },
      },
    },
  },
});
