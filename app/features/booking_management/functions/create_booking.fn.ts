import { db } from "@/db/database";
import { room_booking } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { createInsertSchema } from "drizzle-zod";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";

const request = createInsertSchema(room_booking)
  .merge(z.object({
    start: z.string().transform((v) => Temporal.PlainDateTime.from(v)),
    end: z.string().transform((v) => Temporal.PlainDateTime.from(v)),
  }));

export type CreateBookingRequest = z.input<typeof request>;

export const createBookingFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: CreateBookingRequest) => request.parse(data))
  .handler(async ({ data }) => {
    await db.insert(room_booking).values(data);
  });
