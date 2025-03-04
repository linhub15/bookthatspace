import { z } from "zod";
import { openChannel } from "./shared/open_channel";
import { createServerFn } from "@tanstack/react-start";
import { googleCalendarMiddleware } from "./calendar.middleware.js";
import { authMiddleware } from "../auth/auth_middleware.js";

export const ResumeSyncRequest = z.object({
  calendarId: z.string(),
});

export const resumeCalendarSync = createServerFn()
  .middleware([authMiddleware, googleCalendarMiddleware])
  .validator((request: z.infer<typeof ResumeSyncRequest>) =>
    ResumeSyncRequest.parse(request)
  )
  .handler(async ({ data, context }) => {
    throw new Error("Not implemented");

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
  });
