import { api } from "@/clients/api";
import { calendar } from "@/clients/googleapis";
import { supabase } from "@/clients/supabase";
import { Card } from "@/components/card";
import { ToggleSwitch } from "@/components/form/toggle_switch";
import { useProfile } from "@/features/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function Profile() {
  const { data: profile } = useProfile();
  if (!profile) return;

  return (
    <div className="space-y-4">
      <Card>
        <div className="px-4 py-6 sm:px-6">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Account details and settings.
          </p>
        </div>
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {profile.name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">
                Email address
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {profile.email}
              </dd>
            </div>
          </dl>
        </div>
      </Card>

      <Calendars />
    </div>
  );
}

function Calendars() {
  const calendars = useCalendars();
  const enableCalendar = useEnableCalendar();

  return (calendars.data && calendars.data.length > 0 && (
    <Card>
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Google Calendars
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Calendar settings are managed by{" "}
          <a
            className="underline text-blue-600"
            target="_blank"
            href="https://calendar.google.com"
          >
            Google Calendars
          </a>.
        </p>
      </div>
      <div className="border-t border-gray-100 px-4 py-6 sm:px-6 space-y-4">
        {calendars.data.map((d) => (
          <ul key={d.calendar.id}>
            <li className="flex mt-1 justify-between max-w-sm w-full">
              <div className="space-x-2">
                <div
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: d.calendar.backgroundColor }}
                >
                </div>
                <span>
                  {d.calendar.summaryOverride || d.calendar.summary}{" "}
                  ({d.calendar.accessRole})
                </span>
              </div>
              <div>
                <ToggleSwitch
                  value={d.enabled?.sync_enabled ?? false}
                  isPending={enableCalendar?.isPending}
                  onChange={(value) =>
                    enableCalendar.mutateAsync({
                      calendarId: d.calendar.id,
                      enabled: value,
                    })}
                />
              </div>
            </li>
          </ul>
        ))}
      </div>
    </Card>
  ));
}

function useEnableCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: { calendarId: string; enabled?: boolean }) => {
      const disable = () =>
        supabase
          .from("google_calendar")
          .delete()
          .eq("id", args.calendarId);

      const enable = () =>
        supabase
          .from("google_calendar")
          .upsert({ id: args.calendarId, sync_enabled: true });

      const response = args.enabled ? await enable() : await disable();
      await queryClient.invalidateQueries({
        queryKey: ["google", "calendars"],
      });
      return response;
    },
  });
}

function useCalendars() {
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
