import { calendar } from "@/app/clients/googleapis";
import { Card } from "@/app/components/card";
import { ToggleSwitch } from "@/app/components/form/toggle_switch";
import { useProfile } from "@/app/features/hooks";
import {
  disableCalendar,
  enableCalendar,
} from "@/lib/google_calendar/enable_calendar.server";
import { getAccessToken } from "@/lib/google_calendar/get_access_token.server";
import { listCalendars } from "@/lib/google_calendar/list_calendars.server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/profile")({
  component: RouteComponent,
});

function RouteComponent() {
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

      {/* <Calendars /> */}
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
            rel="noreferrer"
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
      const disable = () => disableCalendar({ data: { id: args.calendarId } });
      const enable = () => enableCalendar({ data: { id: args.calendarId } });

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
      const { access_token } = await getAccessToken();

      if (!access_token) {
        alert("Missing access token");
        return;
      }

      const response = await calendar.calendarList.list(access_token);

      const enabledCalendars = await listCalendars();

      return response.items.map((item) => ({
        calendar: item,
        enabled: enabledCalendars.find((c) => c.id === item.id),
      }));
    },
  });
}
