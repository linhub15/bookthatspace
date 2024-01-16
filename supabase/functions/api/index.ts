import { Hono, validator } from "hono/mod.ts";
import {
  rejectBooking,
  RejectBookingRequest,
} from "./actions/reject_booking.ts";

// todo: replace basePath string with `import.meta.dirname` in Deno 1.40.0
export const app = new Hono().basePath("/api");

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
    await rejectBooking(request);
    return c.text("ok", 200);
  },
);

Deno.serve(app.fetch);
