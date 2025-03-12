import { db } from "@/db/database";
import { room_booking } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { mailer } from "@/lib/email/mailer";
import BookingAccepted from "@/lib/email/templates/booking_accepted";
import { render } from "@react-email/components";
import { createServerFn } from "@tanstack/react-start";
import { eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { Route as publicBookingRoute } from "@/routes/@/booking-success.$bookingId";

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
      .returning({ ...getTableColumns(room_booking) });

    const booking = updated.at(0);

    if (!booking) {
      throw new Error("Error AcceptBooking failed");
    }

    await mailer.send({
      to: booking.bookedByEmail,
      subject: "Booking Accepted",
      html: await render(
        BookingAccepted({
          name: booking.bookedByName,
          url: new URL(publicBookingRoute.fullPath, process.env.VITE_APP_URL)
            .toString(),
        }),
      ),
    });
  });
