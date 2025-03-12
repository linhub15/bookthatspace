import { db } from "@/db/database";
import { room_booking } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { mailer } from "@/lib/email/mailer";
import { render } from "@react-email/components";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { Route as publicBookingRoute } from "@/routes/@/booking-success.$bookingId";
import BookingRejected from "@/lib/email/templates/booking_rejected";

const request = z.object({
  bookingId: z.string(),
  reason: z.string(),
});
export type RejectBookingRequest = z.infer<typeof request>;

export const rejectBookingFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: RejectBookingRequest) => request.parse(data))
  .handler(async ({ data, context }) => {
    const updateResult = await db
      .update(room_booking)
      .set({ status: "rejected" })
      .where(eq(room_booking.id, data.bookingId))
      .returning();

    const rejected = updateResult.at(0);
    if (!rejected) {
      throw new Error("Error rejecting booking");
    }

    await mailer.send({
      to: rejected.bookedByEmail,
      subject: "Booking Accepted",
      html: await render(
        BookingRejected({
          name: rejected.bookedByName,
          url: new URL(publicBookingRoute.fullPath, process.env.VITE_APP_URL)
            .toString(),
        }),
      ),
    });
  });
