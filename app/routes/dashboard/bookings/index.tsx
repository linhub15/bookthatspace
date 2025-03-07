import { Card } from "@/components/card";
import { CreateBookingModalButton } from "@/features/booking_management/create_booking_modal_button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Route as bookingsIndexRoute } from "./index";
import { maskDate, maskDurationSince, maskTimeRange } from "@/lib/masks/masks";
import { Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils/cn";
import { useRoomBookingList } from "@/features/booking_management/hooks/use_room_booking_list";
import { asPlainDate } from "@/lib/types/safe_date";
import { Route as viewBookingRoute } from "./$bookingId.view";

export const Route = createFileRoute("/dashboard/bookings/")({
  component: RouteComponent,
  validateSearch: (search: { tab?: Tab }) => search,
});

type Tab = "upcoming" | "past" | "all";

function RouteComponent() {
  const tab = Route.useSearch().tab ?? "upcoming";
  const tabOptions: {
    name: string;
    value: Tab;
  }[] = [
    { name: "Upcoming", value: "upcoming" },
    { name: "Past", value: "past" },
  ];

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
            <CreateBookingModalButton />
          </div>
        </div>
        <Tabs options={tabOptions} value={tab} />
        <BookingList tab={tab} />
      </Card>
    </>
  );
}

type TabsProps = {
  options: {
    name: string;
    value: Tab;
    count?: number;
  }[];
  value: Tab;
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

function BookingList(props: { tab: Tab }) {
  const { data } = useRoomBookingList({ type: props.tab });

  if (!data) return;

  const groups = Map.groupBy(
    data,
    ({ start }) => asPlainDate(start).toString(),
  );
  const bookingGroups = Array.from(groups);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
      {bookingGroups.map(([key, bookings]) => (
        <Fragment key={key}>
          <ul className="space-y-6">
            {bookings?.map((booking) => (
              <li key={booking.id}>
                <Link
                  className="flex flex-col sm:flex-row gap-x-6 px-5 py-3 rounded-lg shadow-xs ring-1 ring-gray-900/5 hover:bg-gray-50"
                  to={viewBookingRoute.to}
                  params={{ bookingId: booking.id }}
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
                      {booking.bookedByName}{" "}
                      <span className="text-sm text-muted">
                        ({booking.bookedByEmail})
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-normal text-xs text-gray-700">
                      Received {maskDurationSince(booking.createdAt)}
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
