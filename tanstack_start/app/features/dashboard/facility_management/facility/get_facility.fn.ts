import { user } from "@/app/db/auth_schema";
import { db } from "@/app/db/database";
import { facility, profile } from "@/app/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

export const getFacilityFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const result = await db.select({ facility })
      .from(facility)
      .innerJoin(profile, eq(facility.profileId, profile.id))
      .innerJoin(user, eq(profile.userId, context.session.user.id))
      .where(eq(user.id, context.session.user.id))
      .limit(1);

    return result.at(0)?.facility ?? null;
  });
