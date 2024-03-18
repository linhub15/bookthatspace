import { useQuery } from "@tanstack/react-query";
import { Temporal } from "@js-temporal/polyfill";
import { supabase } from "../../../clients/supabase";
import { Fragment } from "react";
import {
  maskDate,
  maskDurationSince,
  maskTimeRange,
} from "../../../lib/masks/masks";
import { cn } from "@/lib/utils/cn";
import { Link, useSearch } from "@tanstack/react-router";
import { Card } from "@/components/card";
import { bookingRoute, bookingsIndexRoute } from "../dashboard.routes";
import { useCreateBookingModal } from "./use_create_booking_modal";

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

  const createBookingModal = useCreateBookingModal();

  return (
    <>
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
          <div>
            <button
              className="block text-nowrap bg-blue-600 rounded text-white py-2 px-4 w-fit"
              onClick={() => createBookingModal.open()}
            >
              Add Booking
            </button>
          </div>
        </div>
        <Tabs options={tabOptions} value={tab} />
        <BookingList tab={tab} />
      </Card>
      <createBookingModal.Modal />
    </>
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
          .eq("status", "scheduled")
          .filter("start", "gte", today);
      case type === "past":
        return baseQuery()
          .eq("status", "scheduled")
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
              replace
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
      {bookingGroups?.map(([group, bookings]) => (
        <Fragment key={group}>
          <ul role="list" className="space-y-6">
            {bookings?.map((booking) => (
              <li key={booking.id}>
                <Link
                  className="flex flex-col sm:flex-row gap-x-6 px-5 py-3 rounded-lg shadow-sm ring-1 ring-gray-900/5 hover:bg-gray-50"
                  to={bookingRoute.to}
                  params={{ booking_id: booking.id }}
                >
                  <div className="w-full sm:w-52 flex sm:flex-col justify-between">
                    <div className="space-x-2 sm:space-x-0">
                      <span className="text-sm font-medium leading-6 text-gray-900">
                        {maskDate(booking.start)}
                      </span>
                      <span className="sm:block text-sm text-muted whitespace-nowrap">
                        <time dateTime={booking.start}>
                          {maskTimeRange(booking.start, booking.end)}
                        </time>
                      </span>
                    </div>
                    <span className="block text-sm text-muted">
                      {booking.room?.name}
                    </span>
                  </div>
                  <div className="w-full">
                    <p className="truncate">
                      {booking.booked_by_name}{" "}
                      <span className="text-sm text-muted">
                        ({booking.booked_by_email})
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-normal text-xs text-gray-700">
                      Received {maskDurationSince(booking.created_at)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  );
}
