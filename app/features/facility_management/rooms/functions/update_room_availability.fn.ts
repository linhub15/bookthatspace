import { db } from "@/db/database";
import { room_availability } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { listRoomAvailabilityFn } from "./list_room_availability.fn";
import { and, eq, inArray } from "drizzle-orm";
import { zRoomAvailabilityInsert } from "@/db/types";
import { Temporal } from "temporal-polyfill";

const request = z.object({
  roomId: z.string(),
  next: z.array(zRoomAvailabilityInsert.merge(z.object({
    start: z.string().transform((v) => Temporal.PlainTime.from(v)),
    end: z.string().transform((v) => Temporal.PlainTime.from(v)),
  }))),
});
export type UpdateRoomAvailabilityRequest = z.input<typeof request>;

export const updateRoomAvailabilityFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: UpdateRoomAvailabilityRequest) => request.parse(data))
  .handler(async ({ data }) => {
    const { roomId, next } = data;

    const prev = await listRoomAvailabilityFn({ data: { roomId } });

    await db.transaction(async (transaction) => {
      if (prev.length) {
        const toDelete = prev.filter((old) =>
          !next.map((n) => n.id).includes(old.id)
        ).map((p) => p.id);

        await transaction
          .delete(room_availability)
          .where(and(
            eq(room_availability.roomId, roomId),
            inArray(room_availability.id, toDelete),
          ));
      }

      // Using a loop instead of passing in array because we may need to update
      for (const availability of next) {
        await transaction
          .insert(room_availability)
          .values(availability)
          .onConflictDoUpdate({
            target: [room_availability.id],
            set: availability,
          });
      }
    });
  });
