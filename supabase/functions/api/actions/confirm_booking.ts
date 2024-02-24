import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { Database } from "@/lib/types/supabase_types.d.ts";
import { hasher } from "../gateways/hasher.ts";
import { getEnv } from "../utils.ts";

export const ConfirmBookingRequest = z.object({
  id: z.string(),
  email: z.string(),
  hash: z.string(),
}).refine(async (data) =>
  data.hash === await hasher.hash(data.id.concat(data.email))
);

type Request = z.infer<typeof ConfirmBookingRequest>;

export async function confirmBooking(
  request: Request,
  deps: { supabase: SupabaseClient<Database> },
) {
  await deps.supabase.from("room_booking")
    .update({
      email_confirmed_at: new Date().toISOString(),
    })
    .eq("id", request.id)
    .eq("booked_by_email", request.email);

  // todo: email the staff member that it is confirmed

  return new URL(`/p/${request.id}`, getEnv("FRONTEND_URL"));
}
