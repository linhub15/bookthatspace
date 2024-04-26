import { Hono } from "hono/mod.ts";
import { supabase } from "./middleware/supabase.ts";
import { zValidator } from "./middleware/z_validator.ts";
import {
  acceptBooking,
  AcceptBookingRequest,
} from "./actions/booking/accept_booking.ts";
import {
  rejectBooking,
  RejectBookingRequest,
} from "./actions/booking/reject_booking.ts";
import {
  requestBooking,
  RequestBookingRequest,
} from "./actions/booking/request_booking.ts";
import {
  confirmBooking,
  ConfirmBookingRequest,
} from "./actions/booking/confirm_booking.ts";

const booking = new Hono();

booking.post(
  "/accept_booking",
  supabase(),
  zValidator("json", AcceptBookingRequest),
  async (c) => {
    const request = c.req.valid("json");
    await acceptBooking(request, { supabase: c.var.supabase });
    return c.text("booking accepted");
  },
);

booking.post(
  "/reject_booking",
  supabase(),
  zValidator("json", RejectBookingRequest),
  async (c) => {
    const request = c.req.valid("json");
    await rejectBooking(request, { supabase: c.var.supabase });
    return c.text("booking rejected");
  },
);

booking.post(
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

booking.get(
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

export { booking };
