import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { Database } from "@/lib/types/supabase_types.d.ts";

const watchResponse = z.object({
  kind: z.literal("api#channel"),
  /** ID you specified for this channel. */
  id: z.string(),
  /** ID of the watched resource. */
  resourceId: z.string(),
  /** Version-specific ID of the watched resource.
   * "https://www.googleapis.com/calendar/v3/calendars/my_calendar@gmail.com/events";
   */
  resourceUri: z.string(),
  /** Present only if one was provided.
   * `target=myApp-myCalendarChannelDest`
   */
  token: z.string().optional(),
  /** Actual expiration time as Unix timestamp (in ms), if applicable. */
  expiration: z.number().optional(),
});

type Request = {
  /** The full URL receiving the google calendar notification. Must be https. */
  address: string;
  /** my_calendar@gmail.com */
  resourcePath: string;
  /** User's Auth Token for the resource */
  authToken: string;
};

/** https://developers.google.com/calendar/api/guides/push#make-watch-requests */
export async function watch(
  request: Request,
  deps: { supabase: SupabaseClient<Database> },
) {
  const id = self.crypto.randomUUID();
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${request.resourcePath}/events/watch`,
  );

  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${request.authToken}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      id: id,
      type: "web_hook",
      address: request.address,
      token: "target=myApp-myCalendarChannelDest", // (Optional) Your channel token. to prevent spoofing
      expiration: 1426325213000, // (Optional) Your requested channel expiration time.
    }),
  });

  const valid = watchResponse.safeParse(await response.json());
  if (valid.success) {
    // store the channel subscription to db
    // deps.supabase.from("")
    return;
  }

  throw new Error(`Failed to watch calendar ${request.resourcePath}`);
}
