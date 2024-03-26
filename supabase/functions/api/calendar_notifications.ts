import { supabase, SupabaseEnv } from "./middleware/supabase.ts";
import { Hono } from "hono/mod.ts";
import { zValidator } from "./middleware/z_validator.ts";
import { NotificationHeaderSchema } from "./actions/google_calendar/handle_notification.ts";

const notificationReveiver = new Hono<SupabaseEnv>();

notificationReveiver.post(
  "google_calendar",
  supabase(),
  zValidator("header", NotificationHeaderSchema),
  async (c) => {
    const thing = c.req.valid("header");
    // todo
  },
);

export { notificationReveiver };
