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
export type RoomBookingStatus = typeof room_booking_status.enumValues[number];

export const zRoomSelect = createSelectSchema(room);
export type RoomSelect = z.infer<typeof zRoomSelect>;

export const zRoomAvailabilityInsert = createInsertSchema(room_availability);
export type RoomAvailabilityInsert = z.infer<typeof zRoomAvailabilityInsert>;

export const zRoomAvailabilitySelect = createSelectSchema(room_availability);
export type RoomAvailabilitySelect = z.infer<typeof zRoomAvailabilitySelect>;

export const zRoomBookingSelect = createSelectSchema(room_booking);
export type RoomBookingSelect = z.infer<typeof zRoomBookingSelect>;
