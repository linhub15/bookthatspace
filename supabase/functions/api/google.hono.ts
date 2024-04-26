import { Hono } from "hono/mod.ts";
import { supabase } from "./middleware/supabase.ts";
import { zValidator } from "./middleware/z_validator.ts";
import {
  handleNotification,
  NotificationHeader,
} from "./actions/google_calendar/handle_notification.ts";
import { googleApi } from "./middleware/google_api.ts";
import { getAccessToken } from "./actions/google_calendar/get_access_token.ts";
import {
  startSync,
  StartSyncRequest,
} from "./actions/google_calendar/start_sync.ts";
import {
  pauseSync,
  PauseSyncRequest,
} from "./actions/google_calendar/pause_sync.ts";
import {
  resumeSync,
  ResumeSyncRequest,
} from "./actions/google_calendar/resume_sync.ts";

const google = new Hono();

google.get("token", supabase(), async (c) => {
  const response = await getAccessToken(undefined, {
    supabase: c.var.supabase,
  });
  return c.json(response);
});

google.post(
  "calendar/notification",
  supabase(),
  zValidator("header", NotificationHeader),
  googleApi(),
  async (c) => {
    const header = c.req.valid("header");
    await handleNotification({ header: header });
    return c.text("");
  },
);

google.post(
  "calendar/sync",
  supabase(),
  zValidator("json", StartSyncRequest),
  googleApi(),
  async (c) => {
    const request = c.req.valid("json");
    await startSync(request, c.var);
    return c.text("synced");
  },
);

google.post(
  "calendar/pause",
  supabase(),
  zValidator("json", PauseSyncRequest),
  googleApi(),
  async (c) => {
    const request = c.req.valid("json");
    await pauseSync(request, c.var);
    return c.text("paused");
  },
);

google.post(
  "calendar/resume",
  supabase(),
  zValidator("json", ResumeSyncRequest),
  googleApi(),
  async (c) => {
    const request = c.req.valid("json");
    await resumeSync(request, c.var);
    return c.text("resumed");
  },
);

export { google };
