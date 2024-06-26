// Manual creation of the client until a way to share types between Deno and Node is found.
// or if we can run Vite using Deno

// naming is underscored because it is not meant to be consumed by the frontend directly.
// access this by using the exported `api` object and calling the appropriate function.
// e.g. `api.accept_booking(...)` or `api.google.calendar.sync(...)`

import { supabase, Tables } from "./supabase";

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

async function request_booking(
  request: {
    room_id: string;
    start: string;
    end: string;
    name: string;
    email: string;
    description?: string;
  },
) {
  const { data, error } = await supabase.functions.invoke(
    "api/request_booking",
    {
      method: "POST",
      body: {
        room_booking: {
          room_id: request.room_id,
          start: request.start,
          end: request.end,
          booked_by_name: request.name,
          booked_by_email: request.email,
          description: request.description,
          status: "needs_approval",
        },
      },
    },
  );

  if (error) throw error;

  return data as Tables<"room_booking">;
}

async function get_google_token() {
  const { data, error } = await supabase.functions.invoke(
    "api/google/token",
    { method: "GET" },
  );

  if (error) throw error;

  return data as {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: "Bearer";
  };
}

async function sync_google_calendar(request: {
  roomId: string;
  calendarId: string;
  initialMonthsToPull?: number;
}) {
  const { error } = await supabase.functions.invoke(
    "api/google/calendar/sync",
    { method: "POST", body: request },
  );

  if (error) throw error;
}

export const api = {
  accept_booking,
  reject_booking,
  request_booking,
  google: {
    token: { get: get_google_token },
    calendar: { sync: sync_google_calendar },
  },
};
