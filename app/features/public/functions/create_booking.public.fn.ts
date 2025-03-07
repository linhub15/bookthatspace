import { db } from "@/db/database";
import { room_booking } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

    // todo: send email confirmation

    const single = inserted.at(0);

    return single;
  });
