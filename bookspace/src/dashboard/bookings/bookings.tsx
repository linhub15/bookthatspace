import { useQuery } from "@tanstack/react-query";
import { Temporal } from "@js-temporal/polyfill";
import { supabase } from "../../supabase";
import { Fragment } from "react";
import { maskDate, maskTimeRange } from "../../masks/masks";
import { cn } from "@/lib/utils/cn";
import { Link, useSearch } from "@tanstack/react-router";
import { bookingsRoute } from "../dashboard.routes";
import { Card } from "@/src/components/card";

type Tabs = "upcoming" | "pending" | "past" | "all";

export function Bookings() {
  const tab = useSearch({ from: bookingsRoute.id }).tab as Tabs ?? "upcoming";
  const { data: pending } = useBookings("pending");
  const tabOptions: {
    name: string;
    value: Tabs;
    count?: number;
  }[] = [
    { name: "Upcoming", value: "upcoming" },
    {
      name: "Pending",
      value: "pending",
      count: pending?.length,
    },
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
            Room bookings
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
      case type === "pending":
        return baseQuery()
          .eq("status", "needs_approval")
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
              search={{ tab: tab.value }}
              key={tab.name}
              className={cn(
                tab.value === props.value
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-500 hover:text-gray-700",
                "rounded-md px-3 py-2 text-sm font-medium inline-flex",
              )}
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
          {bookings?.map((booking) => (
            <Link
              to="/dashboard/bookings/$bookingId/view"
              params={{ bookingId: booking.id }}
              className="max-w-xl rounded-lg shadow-sm ring-1 ring-gray-900/5 select-none p"
              key={booking.id}
            >
              <div className="flex px-6 py-6 justify-between align-top">
                <div>
                  <div>{maskTimeRange(booking?.start, booking?.end)}</div>
                  <div>{booking?.room?.name}</div>
                </div>
                <div className="text-right">
                  <div>{booking?.booked_by_email}</div>
                  <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {booking.status}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Fragment>
      ))}
    </div>
  );
}
