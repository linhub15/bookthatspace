import type { calendar_v3 } from "@googleapis/calendar";
import type { Json, Supabase } from "../../../middleware/supabase.ts";

type Request = {
  calendarId: string;
  initialMonthsToPull: number;
};

export async function pullEvents(request: Request, deps: {
  supabase: Supabase;
  calendar: calendar_v3.Calendar;
}) {
  const now = new Date();
  const listEventsResponse = await deps.calendar
    .events
    .list({
      calendarId: request.calendarId,
      timeMin: now.toISOString(),
      timeMax: setMonth(now, request.initialMonthsToPull).toISOString(),
    });

  if (listEventsResponse.status !== 200) {
    return { error: listEventsResponse.statusText };
  }

  const events = listEventsResponse.data.items;

  const saveEvents = await deps.supabase.from("google_calendar").upsert({
    id: request.calendarId,
    events: events as Json,
  }).eq("id", request.calendarId);

  if (!events || events.length === 0 || saveEvents.error) {
    return { error: saveEvents.error };
  }

  return { data: events };
}

function setMonth(date: Date, months: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}
