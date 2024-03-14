import { calendar } from "@/clients/googleapis";
import { supabase } from "@/clients/supabase";
import { Card } from "@/components/card";
import { useProfile } from "@/features/hooks";
import { useQuery } from "@tanstack/react-query";

export function Profile() {
  const { data: profile } = useProfile();
  const calendars = useCalendars();
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

      {calendars.data && calendars.data.length > 0 && (
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
              <ul key={d.id}>
                <li className="mt-1">
                  <div className="space-x-2">
                    <div
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: d.backgroundColor }}
                    >
                    </div>
                    <span>
                      {d.summaryOverride || d.summary} ({d.accessRole})
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-gray-700">
                    {d.description}
                  </p>
                </li>
              </ul>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function useCalendars() {
  return useQuery({
    queryKey: ["google", "calendars"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.provider_token;
      const response = await calendar.calendarList.list(token);
      return response.items;
    },
  });
}
