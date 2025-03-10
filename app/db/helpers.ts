import { timestamp } from "drizzle-orm/pg-core";

export const defaultColumns = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
};
