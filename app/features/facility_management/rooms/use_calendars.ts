import { api } from "@/clients/api";
import { calendar } from "@/clients/googleapis";
import { supabase } from "@/clients/supabase";
import { useQuery } from "@tanstack/react-query";

export function useCalendars() {
  return useQuery({
    queryKey: ["google", "calendars"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { access_token } = await api.google.token.get();

      if (!access_token) {
        alert("Missing access token");
        return;
      }

      const response = await calendar.calendarList.list(access_token);

      const enabledCalendars = await supabase
        .from("google_calendar")
        .select();

      if (enabledCalendars.error) {
        alert(enabledCalendars.error.message);
        return;
      }

      return response.items.map((item) => ({
        calendar: item,
        enabled: enabledCalendars.data.find((c) => c.id === item.id),
      }));
    },
  });
}
