import { user } from "@/db/auth_schema";
import { db } from "@/db/database";
import { facility, profile, room } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

export const listRoomsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const result = await db.select({ room: room })
      .from(room)
      .innerJoin(facility, eq(room.facilityId, facility.id))
      .innerJoin(profile, eq(facility.profileId, profile.id))
      .innerJoin(user, eq(profile.userId, context.session.user.id))
      .where(eq(user.id, context.session.user.id));

    return result.flatMap((r) => r.room);
  });
