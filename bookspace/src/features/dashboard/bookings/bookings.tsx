import { useQuery } from "@tanstack/react-query";
import { Temporal } from "@js-temporal/polyfill";
import { supabase } from "../../../clients/supabase";
import { Fragment } from "react";
import { maskDate, maskDurationSince } from "../../../masks/masks";
import { cn } from "@/lib/utils/cn";
import { Link, useSearch } from "@tanstack/react-router";
import { Card } from "@/src/components/card";
import { bookingRoute, bookingsIndexRoute } from "../dashboard.routes";

type Tabs = "upcoming" | "past" | "all";

export function Bookings() {
  const tab = useSearch({ from: bookingsIndexRoute.id }).tab as Tabs ??
    "upcoming";
  const tabOptions: {
    name: string;
    value: Tabs;
  }[] = [
    { name: "Upcoming", value: "upcoming" },
    { name: "Past", value: "past" },
  ];

  return (
    <Card>
      <div className="px-4 py-6 sm:px-6 flex justify-between">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Bookings
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Scheduled bookings
          </p>
        </div>
      </div>
      <Tabs options={tabOptions} value={tab} />
      <BookingList tab={tab} />
    </Card>
  );
}

function useBookings(type: "upcoming" | "pending" | "past" | "all") {
  const today = Temporal.Now.plainDateISO();

  const baseQuery = () =>
    supabase.from("room_booking").select("*, room (name)");

  const queryFn = async () => {
    switch (true) {
      case type === "upcoming":
        return baseQuery()
          .eq("status", "active")
          .filter("start", "gte", today);
      case type === "past":
        return baseQuery()
          .eq("status", "active")
          .filter("start", "lt", today);
      default:
        return baseQuery();
    }
  };
  const query = useQuery({
    queryKey: ["room_bookings", type, today],
    queryFn: async () => {
      const { data, error } = await queryFn();
      if (error) {
        alert(error.message);
        return;
      }

      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return query;
}

type TabsProps = {
  options: {
    name: string;
    value: Tabs;
    count?: number;
  }[];
  value: Tabs;
};

function Tabs(props: TabsProps) {
  const tabs = props.options;

  return (
    <>
      <div className="px-4 pb-2 sm:px-6 border-b border-gray-200 overflow-x-auto">
        <nav
          className="-mb-px flex space-x-6 md:space-x-8"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <Link
              className={cn(
                tab.value === props.value
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-500 hover:text-gray-700",
                "rounded-md px-3 py-2 text-sm font-medium inline-flex",
              )}
              search={{ tab: tab.value }}
              key={tab.name}
              from={bookingsIndexRoute.to}
            >
              {tab.name}
              {tab.count
                ? (
                  <span
                    className={cn(
                      tab.value === props.value
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-900",
                      "ml-2 rounded-full py-0.5 px-2.5 text-xs font-medium inline-block",
                    )}
                  >
                    {tab.count}
                  </span>
                )
                : null}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

function BookingList(props: { tab: Tabs }) {
  const { data } = useBookings(props.tab);

  // Wait for Safari to support Map.groupBy()
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy#browser_compatibility
  const grouped: Map<string, typeof data> = new Map();
  data?.forEach((booking) => {
    const key = Temporal.PlainDate
      .from(booking.start)
      .toString();

    if (grouped.has(key)) {
      grouped.get(key)?.push(booking);
      return;
    }
    grouped.set(key, [booking]);
  });

  const bookingGroups = Array.from(grouped);
  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
      {bookingGroups?.map(([date, bookings], idx) => (
        <Fragment key={idx}>
          <h4>{maskDate(date)}</h4>
          <ul role="list" className="divide-y divide-gray-100">
            {bookings?.map((booking) => (
              <li
                className="flex items-center justify-between gap-x-6 py-5"
                key={booking.id}
              >
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {booking.room?.name}
                    </p>
                    <p
                      className={cn(
                        "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                      )}
                    >
                      {booking.status}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                    <p className="whitespace-nowrap">
                      Booked for{" "}
                      <time dateTime={booking.start}>
                        {maskDate(booking.start)}
                      </time>
                    </p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p className="truncate">
                      {booking.booked_by_name} ({booking.booked_by_email})
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Link
                    to={bookingRoute.to}
                    params={{ booking_id: booking.id }}
                    className="hidden w-fit rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                    key={booking.id}
                  >
                    Review
                  </Link>

                  <span className="font-normal text-xs text-gray-700">
                    Received {maskDurationSince(booking.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  );
}
