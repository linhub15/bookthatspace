import { db } from "@/app/db/database";
import { room_booking } from "@/app/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

const request = createInsertSchema(room_booking);
export type CreateBookingRequest = z.infer<typeof request>;

export const createBookingFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: CreateBookingRequest) => request.parse(data))
  .handler(async ({ data }) => {
    await db.insert(room_booking).values(data);
  });
