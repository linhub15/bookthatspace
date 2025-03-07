import { db } from "@/db/database";
import { google_calendar } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { googleCalendarMiddleware } from "@/lib/google_calendar/calendar.middleware";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const PauseSyncRequest = z.object({
  calendarId: z.string(),
});

/** https://developers.google.com/calendar/api/guides/push#stopping */
export const pauseCalendarSync = createServerFn()
  .middleware([authMiddleware, googleCalendarMiddleware])
  .validator((data: z.infer<typeof PauseSyncRequest>) =>
    PauseSyncRequest.parse(data)
  )
  .handler(async ({ data, context }) => {
    const updated = await db.update(google_calendar)
      .set({ sync_enabled: false })
      .where(eq(google_calendar.id, data.calendarId))
      .returning();

    const calendar = updated.at(0);

    if (!calendar) {
      throw new Error("Calendar not found");
    }

    const stopResponse = await context.calendar.channels.stop({
      requestBody: {
        id: calendar.sync_channel_id,
        resourceId: calendar.id,
      },
    });

    if (stopResponse.status !== 200) {
      throw stopResponse;
    }
  });
