import { SupabaseClient } from "@supabase/supabase-js";
import { html, sendEmail } from "../gateways/email.ts";
import { z } from "zod";
import { Database } from "@/lib/types/supabase_types.d.ts";

export const RejectBookingRequest = z.object({
  booking_id: z.string(),
  reason: z.string(),
});

type RejectBookingRequest = z.infer<typeof RejectBookingRequest>;

export async function rejectBooking(
  request: RejectBookingRequest,
  deps: { supabase: SupabaseClient<Database> },
) {
  const { data, error } = await deps.supabase.from("room_booking")
    .update({ status: "rejected" })
    .eq("id", request.booking_id)
    .select("booked_by_email, booked_by_name")
    .single();

  if (error) {
    throw error;
  }

  await sendEmail({
    to: data.booked_by_email,
    subject: "Booking rejected",
    html: html`
      <p>Hi ${data.booked_by_name}, your booking was rejected.</p>
      ${request.reason && html`<p>${request.reason}</p>`}
    `,
  });
}
