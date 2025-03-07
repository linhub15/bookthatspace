import type { calendar_v3 } from "@googleapis/calendar";
import type { Supabase } from "../../../middleware/supabase.ts";
import { getEnv } from "../../../utils.ts";

type Request = {
  calendarId: string;
};

/** Opens and persists channel to google_calendar */
export async function openChannel(
  request: Request,
  deps: { supabase: Supabase; calendar: calendar_v3.Calendar },
) {
  /** https://developers.google.com/calendar/api/guides/push#make-watch-requests */
  const channelId = self.crypto.randomUUID();

  const address = getEnv(
    "DEV_WEBHOOK_PROXY_URL",
    new URL(
      "/api/google/calendar/notification",
      getEnv("API_EXTERNAL_URL"),
    ).toString(),
  );

  const channel = await deps.calendar.events.watch({
    calendarId: request.calendarId,
    requestBody: {
      id: channelId,
      type: "web_hook",
      address: address.toString(),
      token: undefined, // Prevents spoofing
      expiration: undefined, // @default 7 days
    },
  });

  if (channel.status !== 200 || !channel.data.expiration) {
    return { error: channel.statusText };
  }

  const assignChannel = await deps.supabase.from("google_calendar")
    .update({
      sync_enabled: true,
      sync_channel_id: channelId,
      sync_channel_expiry: new Date(Number(channel.data.expiration))
        .toISOString(),
    }).eq("id", request.calendarId);

  if (assignChannel.error) {
    return { error: assignChannel.error };
  }

  return { data: channel.data };
}
