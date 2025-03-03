import * as Google from "./googleapis.types";

function authHeaders(authToken: string) {
  return new Headers({
    "Authorization": `Bearer ${authToken}`,
    "Accept": "application/json",
  });
}

const calendarList = {
  /** https://developers.google.com/calendar/api/v3/reference/calendarList/list */
  list: async (authToken: string | null | undefined) => {
    if (!authToken) throw new Error("Missing auth token");

    const url = new URL(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    );
    url.searchParams.set("key", import.meta.env.VITE_GOOGLE_API_KEY);

    const response = await fetch(url, {
      headers: authHeaders(authToken),
    });
    const data = await response.json() as Google.CalendarList;
    return data;
  },
};

const events = {
  insert: () => {},
};

const freeBusy = {
  query: () => {},
};

export const calendar = {
  calendarList,
  events,
  freeBusy,
};
