// Manual creation of the client until a way to share types between Deno and Node is found.
// or if we can run Vite using Deno

import { supabase } from "./supabase";

async function accept_booking(request: { booking_id: string }) {
  await supabase.functions.invoke("api/accept_booking", {
    method: "POST",
    body: {
      booking_id: request.booking_id,
    },
  });
}

async function reject_booking(request: { booking_id: string; reason: string }) {
  await supabase.functions.invoke("api/reject_booking", {
    method: "POST",
    body: {
      booking_id: request.booking_id,
      reason: request.reason,
    },
  });
}

export const api = {
  accept_booking,
  reject_booking,
};
