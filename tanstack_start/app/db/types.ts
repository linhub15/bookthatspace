import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import {
  type day_of_week,
  room_availability,
  type room_booking_status,
} from "./schema";

export type DayOfWeekEnum = typeof day_of_week.enumValues[number];
export type RoomBookingStatus = typeof room_booking_status.enumValues[number];

export const zRoomAvailabilityInsert = createInsertSchema(room_availability);
export type RoomAvailabilityInsert = z.infer<typeof zRoomAvailabilityInsert>;
export const zRoomAvailabilitySelect = createSelectSchema(room_availability);
export type RoomAvailabilitySelect = z.infer<typeof zRoomAvailabilitySelect>;
