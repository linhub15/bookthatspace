import { db } from "@/app/db/database";
import { room_booking } from "@/app/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

const request = z.object({
  roomBookingId: z.string(),
});

export type AcceptBookingRequest = z.infer<typeof request>;

export const acceptBookingFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: AcceptBookingRequest) => request.parse(data))
  .handler(async ({ data }) => {
    const updated = await db
      .update(room_booking)
      .set({ status: "scheduled" })
      .where(eq(room_booking.id, data.roomBookingId))
      .returning({ booking: room_booking });

    // todo: send the email
  });
