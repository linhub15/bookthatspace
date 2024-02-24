import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/types/supabase_types.d.ts";
import { z } from "zod";
import { sendEmail } from "../gateways/email.ts";
import { html } from "../utils.ts";

export const AcceptBookingRequest = z.object({
  booking_id: z.string(),
});

type Request = z.infer<typeof AcceptBookingRequest>;

export async function acceptBooking(
  request: Request,
  deps: { supabase: SupabaseClient<Database> },
) {
  const { data, error } = await deps.supabase.from("room_booking")
    .update({ status: "scheduled" })
    .eq("id", request.booking_id)
    .select("booked_by_email, booked_by_name")
    .single();

  if (error) {
    throw error;
  }

  await sendEmail({
    to: data.booked_by_email,
    subject: "Booking accepted",
    html: html`
      <p>Hi ${data.booked_by_name}, your booking was accepted and has been scheduled in our system.</p>
    `,
  });
}
