import { db } from "@/app/db/database";
import { google_calendar } from "@/app/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const enableCalendar = createServerFn()
  .middleware([authMiddleware])
  .validator((data: { id: string }) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    await db
      .insert(google_calendar)
      .values({
        id: data.id,
        profile_id: context.session.user.id,
        sync_enabled: true,
        events: [],
      })
      .onConflictDoUpdate({
        target: google_calendar.id,
        set: { sync_enabled: true, events: [] },
      });
  });

export const disableCalendar = createServerFn()
  .validator((data: { id: string }) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    await db
      .delete(google_calendar)
      .where(eq(google_calendar.id, data.id));
  });
