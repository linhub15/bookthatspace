import { Hono } from "hono/mod.ts";
import { cors } from "hono/middleware.ts";
import { supabase, SupabaseEnv } from "./middleware/supabase.ts";
import { zValidator } from "./middleware/z_validator.ts";
import { notificationReveiver } from "./calendar_notifications.ts";

import {
  rejectBooking,
  RejectBookingRequest,
} from "./actions/reject_booking.ts";
import {
  acceptBooking,
  AcceptBookingRequest,
} from "./actions/accept_booking.ts";
import {
  requestBooking,
  RequestBookingRequest,
} from "./actions/request_booking.ts";
import {
  confirmBooking,
  ConfirmBookingRequest,
} from "./actions/confirm_booking.ts";
import { getAccessToken } from "./actions/google_calendar/get_access_token.ts";

export const app = new Hono<SupabaseEnv>().basePath("/api");

app.use("*", cors());
app.get("/", (c) => c.text("alive"));

app.post(
  "/accept_booking",
  supabase(),
  zValidator("json", AcceptBookingRequest),
  async (c) => {
    const request = c.req.valid("json");
    await acceptBooking(request, { supabase: c.var.supabase });
    return c.text("booking accepted");
  },
);

app.post(
  "/reject_booking",
  supabase(),
  zValidator("json", RejectBookingRequest),
  async (c) => {
    const request = c.req.valid("json");
    await rejectBooking(request, { supabase: c.var.supabase });
    return c.text("booking rejected");
  },
);

app.post(
  "/request_booking",
  supabase("anon"),
  zValidator("json", RequestBookingRequest),
  async (c) => {
    const request = c.req.valid("json");
    const response = await requestBooking(request, {
      supabase: c.var.supabase,
    });
    return c.json(response);
  },
);

app.get(
  "/confirm_booking_email",
  supabase("anon"),
  zValidator("query", ConfirmBookingRequest),
  async (c) => {
    const request = c.req.valid("query");
    const response = await confirmBooking(request, {
      supabase: c.var.supabase,
    });

    return c.redirect(response.toString());
  },
);

app.get("/google/token", supabase(), async (c) => {
  const response = await getAccessToken(undefined, {
    supabase: c.var.supabase,
  });
  return c.json(response);
});

app.route("/notifications", notificationReveiver);

Deno.serve(app.fetch);
