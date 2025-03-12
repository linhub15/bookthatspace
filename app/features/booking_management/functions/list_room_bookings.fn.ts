import { user } from "@/db/auth_schema";
import { db } from "@/db/database";
import { facility, profile, room, room_booking } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";

export const listRoomBookingsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const result = await db
      .select({ room_booking, room })
      .from(room_booking)
      .innerJoin(room, eq(room_booking.roomId, room.id))
      .innerJoin(facility, eq(room.facilityId, room.facilityId))
      .innerJoin(profile, eq(facility.profileId, profile.id))
      .innerJoin(user, eq(profile.userId, context.session.user.id))
      .where(and(eq(user.id, context.session.user.id)));

    const mapped = result.map((r) => ({ ...r.room_booking, room: r.room }));

    const serializable = JSON.stringify(mapped, (key, value) => {
      if (key === "start" || key === "end") {
        return value.toString();
      }

      return value;
    });

    return serializable;
  });
