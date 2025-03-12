import { db } from "@/db/database";
import { room_booking } from "@/db/schema";
import { mailer } from "@/lib/email/mailer";
import BookingCreated from "@/lib/email/templates/booking_created";
import { render } from "@react-email/components";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { Route as publicBookingRoute } from "@/routes/@/booking-success.$bookingId";

const request = z.object({
  roomId: z.string(),
  start: z.string(),
  end: z.string(),
  totalCost: z.number().optional(),
  bookedByEmail: z.string(),
  bookedByName: z.string(),
  description: z.string().optional(),
});

export type CreateBookingPublicRequest = z.infer<typeof request>;

export const createBookingPublicFn = createServerFn({ method: "POST" })
  .validator((data: CreateBookingPublicRequest) => request.parse(data))
  .handler(async ({ data }) => {
    const inserted = await db
      .insert(room_booking)
      .values({
        ...data,
        status: "needs_approval",
      })
      .returning();

    await mailer.send({
      to: data.bookedByEmail,
      subject: "Booking received",
      html: await render(
        BookingCreated({
          url: new URL(publicBookingRoute.fullPath, process.env.VITE_APP_URL)
            .toString(),
          name: data.bookedByName,
        }),
      ),
    });

    const single = inserted.at(0);

    return single;
  });
