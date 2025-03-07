import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth_schema";
import type { Address } from "@/lib/types/address";
import { defaultColumns } from "./helpers";

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
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id).notNull(),
  ...defaultColumns,
});

export const profile_relations = relations(profile, ({ one, many }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
  facilities: many(facility),
}));

export const facility = pgTable("facility", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").references(() => profile.id),
  address: jsonb("address").$type<Address>(),
  name: text("name"),
  ...defaultColumns,
});

export const facility_relations = relations(facility, ({ one, many }) => ({
  profile: one(profile, {
    fields: [facility.profileId],
    references: [profile.id],
  }),
  rooms: many(room),
}));

export const room = pgTable("room", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  maxCapacity: integer("max_capacity"),
  address: text("address"),
  hourlyRate: integer("hourly_rate"),
  facilityId: uuid("facility_id").notNull().references(() => facility.id),
  googleCalendarId: text("google_calendar_id"),
  ...defaultColumns,
});

export const room_relations = relations(room, ({ one, many }) => ({
  facility: one(facility, {
    fields: [room.facilityId],
    references: [facility.id],
  }),
  availabilities: many(room_availability),
  images: many(room_image),
}));

export const room_availability = pgTable("room_availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").notNull().references(() => room.id),
  dayOfWeek: day_of_week("day_of_week").notNull(),
  start: time("start").notNull(),
  end: time("end").notNull(),
  ...defaultColumns,
});

export const room_availability_relations = relations(
  room_availability,
  ({ one }) => ({
    room: one(room, {
      fields: [room_availability.roomId],
      references: [room.id],
    }),
  }),
);

export const room_booking = pgTable("room_booking", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").notNull().references(() => room.id),
  profileId: uuid("profile_id").references(() => profile.id),
  start: timestamp("start", { withTimezone: true, mode: "string" }).notNull(),
  end: timestamp("end", { withTimezone: true, mode: "string" }).notNull(),
  status: room_booking_status("status"),
  totalCost: integer("total_cost"),
  bookedByEmail: text("booked_by_email").notNull(),
  bookedByName: text("booked_by_name").notNull(),
  description: text("description"),
  emailConfirmedAt: timestamp("email_confirmed_at"),
  ...defaultColumns,
});

export const room_image = pgTable("room_image", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => room.id, { onDelete: "set null" }),
  path: text().notNull(),
  ...defaultColumns,
});

export const room_photo_relations = relations(room_image, ({ one }) => ({
  room: one(room, {
    fields: [room_image.roomId],
    references: [room.id],
  }),
}));

export const google_calendar = pgTable("google_calendar", {
  id: text("id").notNull(),
  profileId: uuid("profile_id").notNull().references(() => profile.id),
  syncEnabled: boolean("sync_enabled").notNull().default(false),
  events: jsonb("events").notNull(),
  syncChannelId: uuid("sync_channel_id"),
  syncChannelExpiry: timestamp("sync_channel_expiry", { withTimezone: true }),
  ...defaultColumns,
});
