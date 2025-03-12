import { db } from "@/db/database";
import { room_availability, room_booking } from "@/db/schema";
import { asDayOfWeekEnum } from "@/db/types";
import { zPlainDateString } from "@/lib/types/safe_date";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";

type TimeRange = [Temporal.PlainTime, Temporal.PlainTime];

const request = z.object({
  roomId: z.string(),
  date: zPlainDateString,
});

export type ListRoomAvailabilityPublicRequest = z.infer<typeof request>;

export const listRoomAvailabilityPublicFn = createServerFn({ method: "GET" })
  .validator((data: ListRoomAvailabilityPublicRequest) => request.parse(data))
  .handler(async ({ data }) => {
    const roomId = data.roomId;

    const date = Temporal.PlainDate.from(data.date);

    const availability = await db
      .select()
      .from(room_availability)
      .where(and(
        eq(room_availability.roomId, roomId),
        eq(
          room_availability.dayOfWeek,
          asDayOfWeekEnum[date.dayOfWeek],
        ),
      ));

    const open: TimeRange[] = availability.map((a) => [a.start, a.end]);

    const roomBookings = await db
      .select()
      .from(room_booking)
      .where(and(
        eq(room_booking.roomId, roomId),
        sql`date(${room_booking.start}) >= ${date.toString()}`,
        sql`date(${room_booking.start}) <= ${date.add({ days: 1 }).toString()}`,
      ));

    const booked: TimeRange[] = roomBookings.map((b) => [
      b.start.toPlainTime(),
      b.end.toPlainTime(),
    ]);

    return JSON.parse(JSON.stringify(freeTime(open, booked))) as [
      string,
      string,
    ][];
  });

function freeTime(
  open: TimeRange[],
  booked: TimeRange[],
) {
  const freeTime = [...open];
  for (const range of booked) {
    const found = findRangeIndex(range, freeTime);

    if (found === undefined || found === -1) return;

    const [start, end] = freeTime[found];

    freeTime.splice(found, 1, [start, range[0]], [range[1], end]);
  }

  return freeTime;
}

function findRangeIndex(time: TimeRange, open: TimeRange[]) {
  // assumes no open time ranges overlap
  // full match start and end are within
  const gte = (a: Temporal.PlainTime, b: Temporal.PlainTime) =>
    Temporal.PlainTime.compare(a, b) > 0;

  const lte = (a: Temporal.PlainTime, b: Temporal.PlainTime) =>
    Temporal.PlainTime.compare(a, b) < 0;

  const index = open.findIndex((o) => gte(time[0], o[0]) && lte(time[1], o[1]));
  if (index !== -1) return index;
}
