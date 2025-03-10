import { account, session, user as User, verification } from "@/db/auth_schema";
import { db } from "@/db/database";
import { profile } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET,
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
      clientId: process.env.GOOGLE_OAUTH_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
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
