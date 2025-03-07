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
  reject_booking,
  google: {
    token: { get: get_google_token },
    calendar: { sync: sync_google_calendar },
  },
};
