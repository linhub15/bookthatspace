import { html, sendEmail } from "../gateways/email.ts";
import { supabase } from "../gateways/supabase.ts";
import { z } from "zod";

export const RejectBookingRequest = z.object({
  bookingId: z.string(),
  reason: z.string(),
});

type RejectBookingRequest = z.infer<typeof RejectBookingRequest>;

export async function rejectBooking(request: RejectBookingRequest) {
  const { data, error } = await supabase.from("room_booking")
    .update({ status: "rejected" })
    .eq("id", request.bookingId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  await sendEmail({
    to: data.booked_by_email,
    subject: "Booking rejected",
    html:
      html`<p>Hi ${data.booked_by_name}, your booking was rejected because of ${request.reason}</p>`,
  });
}
