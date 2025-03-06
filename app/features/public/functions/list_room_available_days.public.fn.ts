import { db } from "@/app/db/database";
import { room_availability } from "@/app/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

const request = z.object({
  roomId: z.string(),
});

type ListRoomAvailableDaysPublicRequest = z.infer<typeof request>;

export const listRoomAvailableDaysPublicFn = createServerFn({ method: "GET" })
  .validator((data: ListRoomAvailableDaysPublicRequest) => request.parse(data))
  .handler(async ({ data }) => {
    const weekdays = await db
      .select({ dayOfWeek: room_availability.dayOfWeek })
      .from(room_availability)
      .where(eq(room_availability.roomId, data.roomId));

    return weekdays.map((day) => day.dayOfWeek);
  });
