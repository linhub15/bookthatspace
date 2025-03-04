import type { calendar_v3 } from "@googleapis/calendar";
import type { Supabase } from "../../middleware/supabase.ts";
import { z } from "zod";
import { pullEvents } from "./shared/pull_events.ts";
import { openChannel } from "./shared/open_channel.ts";

const INITIAL_MONTHS_TO_PULL = 5;

export const StartSyncRequest = z.object({
  roomId: z.string(),
  /** my_calendar@gmail.com */
  calendarId: z.string(),
  initialMonthsToPull: z.number().optional().default(INITIAL_MONTHS_TO_PULL),
});

export async function startSync(
  request: z.infer<typeof StartSyncRequest>,
  deps: { supabase: Supabase; calendar: calendar_v3.Calendar },
) {
  await pullEvents(request, deps);
  await openChannel(request, deps);

  const associatedToRoom = await deps.supabase.from("room")
    .update({ google_calendar_id: request.calendarId })
    .eq("id", request.roomId);

  if (associatedToRoom.error) {
    throw associatedToRoom.error;
  }
}
