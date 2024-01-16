import { Hono, validator } from "hono/mod.ts";
import { cors } from "hono/middleware.ts";
import { supabaseAuth, SupabaseEnv } from "./middleware/supabase_auth.ts";
import {
  rejectBooking,
  RejectBookingRequest,
} from "./actions/reject_booking.ts";

// todo: replace basePath string with `import.meta.dirname` in Deno 1.40.0
export const app = new Hono<SupabaseEnv>().basePath("/api");

app.use("*", cors(), supabaseAuth());
app.get("/", (c) => c.text("alive"));

app.post(
  "/reject_booking",
  validator("json", (value, c) => {
    const result = RejectBookingRequest.safeParse(value);
    if (!result.success) {
      return c.text(result.error.message, 400);
    }
    return result.data;
  }),
  async (c) => {
    const request = c.req.valid("json");
    await rejectBooking(request, { supabase: c.var.supabase });
    return c.text("ok", 200);
  },
);

Deno.serve(app.fetch);
