async function reject_booking(request: { booking_id: string; reason: string }) {
  await supabase.functions.invoke("api/reject_booking", {
    method: "POST",
    body: {
      booking_id: request.booking_id,
      reason: request.reason,
    },
  });
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
