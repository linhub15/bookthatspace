import { Hono } from "hono/mod.ts";
import { cors } from "hono/middleware.ts";
import { supabaseAuth, SupabaseEnv } from "./middleware/supabase_auth.ts";
import { zValidator } from "./middleware/z_validator.ts";
import {
  rejectBooking,
  RejectBookingRequest,
} from "./actions/reject_booking.ts";
import {
  acceptBooking,
  AcceptBookingRequest,
} from "./actions/accept_booking.ts";

export const app = new Hono<SupabaseEnv>().basePath("/api");

app.use("*", cors(), supabaseAuth());
app.get("/", (c) => c.text("alive"));

app.post(
  "/accept_booking",
  zValidator("json", AcceptBookingRequest),
  async (c) => {
    const request = c.req.valid("json");
    await acceptBooking(request, { supabase: c.var.supabase });
    return c.text("booking accepted");
  },
);

app.post(
  "/reject_booking",
  zValidator("json", RejectBookingRequest),
  async (c) => {
    const request = c.req.valid("json");
    await rejectBooking(request, { supabase: c.var.supabase });
    return c.text("booking rejected");
  },
);

Deno.serve(app.fetch);
