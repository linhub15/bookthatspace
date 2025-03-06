import type { calendar_v3 } from "@googleapis/calendar";
import type { Supabase } from "../../middleware/supabase.ts";
import { z } from "zod";

export const PauseSyncRequest = z.object({
  calendarId: z.string(),
});

/** https://developers.google.com/calendar/api/guides/push#stopping */
export async function pauseSync(
  request: z.infer<typeof PauseSyncRequest>,
  deps: { supabase: Supabase; calendar: calendar_v3.Calendar },
) {
  const { data: calendar, error } = await deps.supabase.from("google_calendar")
    .update({ sync_enabled: false })
    .eq("id", request.calendarId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  const stopResponse = await deps.calendar.channels.stop({
    requestBody: { id: calendar.sync_channel_id, resourceId: calendar.id },
  });

  if (stopResponse.status !== 200) {
    throw stopResponse;
  }
}
