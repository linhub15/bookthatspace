import { user } from "@/app/db/auth_schema";
import { db } from "@/app/db/database";
import { profile, room, room_booking } from "@/app/db/schema";
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
      .innerJoin(profile, eq(room_booking.profileId, profile.id))
      .innerJoin(user, eq(profile.userId, context.session.user.id))
      .where(and(eq(room_booking.profileId, context.session.user.id)));

    const mapped = result.map((r) => ({ ...r.room_booking, room: r.room }));
    return mapped;
  });
