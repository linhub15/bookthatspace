import type { MiddlewareHandler } from "hono/mod.ts";
import type { SupabaseEnv } from "./supabase.ts";
import { auth, calendar, type calendar_v3 } from "@googleapis/calendar";
import { getEnv } from "../utils.ts";

export function googleApi(): MiddlewareHandler<SupabaseEnv & GoogleApiEnv> {
  return async (c, next) => {
    if (!c.var.supabase) {
      throw new Error(
        "`c.var.supabase` not found. useGoogle must be used after useSupabase",
      );
    }

    const { data, error } = await c.var.supabase
      .from("user_provider")
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    const oAuth2 = new auth.OAuth2({
      clientId: getEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
    });
    oAuth2.setCredentials({ refresh_token: data.refresh_token });

    const instance = calendar({ version: "v3", auth: oAuth2 });

    c.set("calendar", instance);
    await next();
  };
}

type GoogleApiEnv = {
  Variables: {
    calendar: calendar_v3.Calendar;
  };
};
