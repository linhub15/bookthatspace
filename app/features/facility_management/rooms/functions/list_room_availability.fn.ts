import { user } from "@/db/auth_schema";
import { db } from "@/db/database";
import { facility, profile, room, room_availability } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";

export const listRoomAvailabilityFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { roomId: string }) => data)
  .handler(async ({ data, context }) => {
    const result = await db.select({ room_availability })
      .from(room_availability)
      .innerJoin(room, eq(room.id, room_availability.roomId))
      .innerJoin(facility, eq(room.facilityId, facility.id))
      .innerJoin(profile, eq(facility.profileId, profile.id))
      .innerJoin(user, eq(profile.userId, context.session.user.id))
      .where(
        and(
          eq(room_availability.roomId, data.roomId),
          eq(user.id, context.session.user.id),
        ),
      );

    return result.map((r) => ({
      ...r.room_availability,
      start: r.room_availability.start.toString(),
      end: r.room_availability.end.toString(),
    }));
  });
