import { db } from "@/db/database";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";

export const listCalendars = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const calendars = await db
      .query.google_calendar
      .findMany({
        where: (calendar, { eq }) =>
          eq(calendar.profile_id, context.session.user.id),
      });

    return calendars.map((calendar) => ({
      id: calendar.id,
      created_at: calendar.created_at,
      profile_id: calendar.profile_id,
      sync_enabled: calendar.sync_enabled,
      // biome-ignore lint/complexity/noBannedTypes: <explanation>
      events: calendar.events as {}, // fixes: unknown -> {}
      sync_channel_id: calendar.sync_channel_id,
      sync_channel_expiry: calendar.sync_channel_expiry,
    }));
  });
