import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import {
  type day_of_week,
  room,
  room_availability,
  room_booking,
  type room_booking_status,
} from "./schema";

export type DayOfWeekEnum = typeof day_of_week.enumValues[number];
/** ISO 8601 Monday is 1 */
export const asDayOfWeekEnum: Record<number, DayOfWeekEnum> = {
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
  7: "sun",
};
export const asDayOfWeek: Record<DayOfWeekEnum, number> = {
  "mon": 1,
  "tue": 2,
  "wed": 3,
  "thu": 4,
  "fri": 5,
  "sat": 6,
  "sun": 7,
};

export type RoomBookingStatusEnum =
  typeof room_booking_status.enumValues[number];

export const zRoomSelect = createSelectSchema(room);
export type RoomSelect = z.infer<typeof zRoomSelect>;

export const zRoomAvailabilityInsert = createInsertSchema(room_availability);
export type RoomAvailabilityInsert = z.infer<typeof zRoomAvailabilityInsert>;

export const zRoomAvailabilitySelect = createSelectSchema(room_availability);
export type RoomAvailabilitySelect = z.infer<typeof zRoomAvailabilitySelect>;

export const zRoomBookingSelect = createSelectSchema(room_booking);
export type RoomBookingSelect = z.infer<typeof zRoomBookingSelect>;
