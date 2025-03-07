import { db } from "@/db/database";
import { room, room_booking } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

const request = z.object({
  bookingId: z.string(),
});

export type GetRoomBookingRequest = z.infer<typeof request>;

export const getRoomBookingFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: GetRoomBookingRequest) => request.parse(data))
  .handler(async ({ data }) => {
    const result = await db
      .select({ booking: room_booking, room: room })
      .from(room_booking)
      .innerJoin(room, eq(room.id, room_booking.roomId))
      .where(
        eq(room_booking.id, data.bookingId),
      );

    return result.at(0);
  });
