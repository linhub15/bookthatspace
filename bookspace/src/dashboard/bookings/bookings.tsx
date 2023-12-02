import { useQuery } from "@tanstack/react-query";
import { Temporal } from "@js-temporal/polyfill";
import { supabase } from "../../supabase";
import { Fragment } from "react";

export function Bookings() {
  const { data: bookingGroups } = useBookings();
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6 flex justify-between">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Bookings
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Room bookings
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
        {bookingGroups?.map(([date, bookings], idx) => (
          <Fragment key={idx}>
            <h4>{maskDate(date)}</h4>
            {bookings.map((booking) => (
              <div
                className="max-w-xl rounded-lg shadow-sm ring-1 ring-gray-900/5 select-none p"
                key={booking.id}
              >
                <div className="flex px-6 py-6 justify-between align-top">
                  <div>
                    <div>{maskTime(booking?.start, booking?.end)}</div>
                    <div>{booking?.room?.name}</div>
                  </div>
                  <div className="text-right">
                    <div>{booking?.booked_by_email}</div>
                    <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Paid
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function maskDate(date: string) {
  return Temporal.PlainDate.from(date).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function maskTime(start: string, end: string) {
  const s = Temporal.Instant.from(start).toLocaleString(
    undefined,
    { hourCycle: "h24", hour: "numeric", minute: "2-digit" },
  );
  const e = Temporal.Instant.from(end).toLocaleString(
    undefined,
    { hourCycle: "h24", hour: "numeric", minute: "2-digit" },
  );

  return `${s} - ${e}`;
}

function useBookings() {
  const query = useQuery({
    queryKey: ["room", "bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("room_booking").select(
        "*, room (name)",
      );
      if (error) {
        alert(error.message);
        return;
      }

      const grouped: Map<string, typeof data> = new Map();

      data.forEach((booking) => {
        const key = Temporal.Instant
          .from(booking.start)
          .toLocaleString()
          .split(",")[0];

        if (grouped.has(key)) {
          grouped.get(key)?.push(booking);
          return;
        }
        grouped.set(key, [booking]);
      });
      return Array.from(grouped);
    },
  });
  return query;
}
