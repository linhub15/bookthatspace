import type { calendar_v3 } from "@googleapis/calendar";
import type { Supabase } from "../../middleware/supabase.ts";
import { z } from "zod";
import { openChannel } from "./shared/open_channel.ts";

export const ResumeSyncRequest = z.object({
  calendarId: z.string(),
});

export async function resumeSync(
  request: z.infer<typeof ResumeSyncRequest>,
  deps: { supabase: Supabase; calendar: calendar_v3.Calendar },
) {
  const reenabledNaive = await deps.supabase.from("google_calendar")
    .update({ sync_enabled: true })
    .eq("id", request.calendarId)
    .gte("sync_channel_expiry", new Date().toISOString())
    .select()
    .maybeSingle();

  if (reenabledNaive.error) {
    throw reenabledNaive.error;
  }

  if (!reenabledNaive.data?.sync_enabled) {
    // success!
    return;
  }

  const { error } = await openChannel(request, deps);
  if (error) throw error;
}
