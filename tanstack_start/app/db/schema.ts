import { relations } from "drizzle-orm";
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
import { user } from "./auth-schema";

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

export const profile = pgTable("profile", {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().defaultNow().notNull(),
  user_id: text().references(() => user.id).notNull(),
});

export const profile_relations = relations(profile, ({ one, many }) => ({
  user: one(user, {
    fields: [profile.user_id],
    references: [user.id],
  }),
  facilities: many(facility),
}));

export const facility = pgTable("facility", {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().defaultNow().notNull(),
  profile_id: uuid().references(() => profile.id),
  address: jsonb(),
  name: text(),
});

export const facility_relations = relations(facility, ({ one, many }) => ({
  profile: one(profile, {
    fields: [facility.profile_id],
    references: [profile.id],
  }),
  rooms: many(room),
}));

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

export const room_relations = relations(room, ({ one, many }) => ({
  facility: one(facility, {
    fields: [room.facility_id],
    references: [facility.id],
  }),
  availabilities: many(room_availability),
}));

export const room_availability = pgTable("room_availability", {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().defaultNow().notNull(),
  room_id: uuid().notNull().references(() => room.id),
  day_of_week: day_of_week(),
  start: timestamp(),
  end: timestamp(),
});

export const room_availability_relations = relations(
  room_availability,
  ({ one }) => ({
    room: one(room, {
      fields: [room_availability.room_id],
      references: [room.id],
    }),
  }),
);

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
