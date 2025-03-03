import {
  boolean,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const day_of_week = pgEnum("day_of_week", [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
]);

export const room_booking_status = pgEnum("room_booking_status", [
  "needs_approval",
  "cancelled",
  "active",
  "rejected",
  "scheduled",
]);

export const facility = pgTable("facility", {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().defaultNow().notNull(),
  profile_id: uuid(),
  address: jsonb(),
  name: text(),
});

export const profile = pgTable("profile", {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().defaultNow().notNull(),
  name: text(),
  email: text().notNull(),
});

export const room = pgTable("room", {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().defaultNow().notNull(),
  name: text().notNull(),
  description: text(),
  max_capacity: numeric(),
  address: text(),
  hourly_rate: numeric(),
  facility_id: uuid().notNull().references(() => facility.id),
});

export const room_availability = pgTable("room_availability", {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().defaultNow().notNull(),
  room_id: uuid().notNull().references(() => room.id),
  day_of_week: day_of_week(),
  start: timestamp(),
  end: timestamp(),
});

export const room_booking = pgTable("room_booking", {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().defaultNow().notNull(),
  room_id: uuid().notNull().references(() => room.id),
  profile_id: uuid().notNull().references(() => profile.id),
  start: timestamp({ withTimezone: true }).notNull(),
  end: timestamp({ withTimezone: true }).notNull(),
  status: room_booking_status(),
  total_cost: numeric(),
  booked_by_email: text().notNull(),
  booked_by_name: text().notNull(),
  description: text(),
  email_confirmed_at: timestamp(),
});

export const room_photo = pgTable("room_photo", {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().defaultNow().notNull(),
  room_id: uuid().notNull(),
  path: text().notNull(),
});

export const google_calendar = pgTable("google_calendar", {
  id: text().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  profile_id: uuid().notNull().references(() => profile.id),
  sync_enabled: boolean().notNull().default(false),
  events: jsonb().notNull(),
  sync_channel_id: uuid(),
  sync_channel_expiry: timestamp({ withTimezone: true }),
});
