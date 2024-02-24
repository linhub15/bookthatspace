import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/types/supabase_types.d.ts";
import { z } from "zod";
import { sendEmail } from "../gateways/email.ts";
import { getEnv, html } from "../utils.ts";
import { hasher } from "../gateways/hasher.ts";
import { ConfirmBookingRequest } from "./confirm_booking.ts";

export const RequestBookingRequest = z.object({
  room_booking: z.object({
    booked_by_email: z.string(),
    booked_by_name: z.string(),
    description: z.string().optional(),
    room_id: z.string(),
    start: z.string(),
    end: z.string(),
    status: z.literal("needs_approval"),
    total_cost: z.number().optional(),
  }),
});

type Request = z.infer<typeof RequestBookingRequest>;

export async function requestBooking(
  request: Request,
  deps: { supabase: SupabaseClient<Database> },
) {
  const response = await deps.supabase
    .from("room_booking")
    .insert(request.room_booking)
    .select()
    .single();

  if (response.error) {
    throw response.error;
  }

  await sendEmailConfirmation({
    booking_id: response.data.id,
    email: response.data.booked_by_email,
    name: response.data.booked_by_name,
  });

  return response.data;
}

async function sendEmailConfirmation(
  args: { name: string; booking_id: string; email: string },
) {
  const confirmation = new URL(
    `/functions/v1/api/confirm_booking_email`,
    getEnv("API_EXTERNAL_URL"),
  );

  const searchParams = await ConfirmBookingRequest.transform(
    (data) => new URLSearchParams(data),
  ).parseAsync({
    id: args.booking_id,
    email: args.email,
    hash: await hasher.hash(args.booking_id.concat(args.email)),
  });
  confirmation.search = searchParams.toString();

  await sendEmail({
    to: args.email,
    subject: "Confirm your booking!",
    html: html`
      <p>Hi ${args.name}, your booking request has been received</p>
      <p>Click this link to confirm your booking.</p>
      <a href="${confirmation.toString()}">${confirmation.toString()}</a>
      <p>Bookings without email confirmation will be removed after 30 days or the day after the booking, whichever comes first</p>
    `,
  });
}
