import { db } from "@/db/database";
import { room_booking } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

const request = z.object({
  bookingId: z.string(),
  reason: z.string(),
});
export type RejectBookingRequest = z.infer<typeof request>;

export const rejectBookingFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: RejectBookingRequest) => request.parse(data))
  .handler(async ({ data, context }) => {
    await db
      .update(room_booking)
      .set({ status: "rejected" })
      .where(eq(room_booking.id, data.bookingId));

    // todo: send email
  });
