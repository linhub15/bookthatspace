import { Card } from "@/components/card";
import { useBookingRequests } from "@/features/booking_management/hooks/use_booking_requests";
import { maskDate, maskDurationSince, maskTimeRange } from "@/lib/masks/masks";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Route as reviewBookingRequestRoute } from "./$bookingId.review";

export const Route = createFileRoute("/dashboard/booking-requests/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card>
      <div className="px-4 py-6 sm:px-6 flex justify-between">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Booking Requests
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Public booking requests show up here.
          </p>
        </div>
      </div>
      <BookingRequestList />
    </Card>
  );
}

function BookingRequestList() {
  const { data } = useBookingRequests();

  if (!data) {
    return;
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
      <ul className="divide-y divide-gray-100 space-y-4">
        {data?.map((booking) => (
          <li key={booking.id}>
            <Link
              className="flex items-center justify-between gap-x-6 p-5 rounded-lg shadow-xs ring-1 ring-gray-900/5 hover:bg-gray-50"
              to={reviewBookingRequestRoute.to}
              params={{ bookingId: booking.id }}
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-start gap-x-3">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {booking.room?.name}
                  </p>
                  <p className="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs ring-1 ring-inset">
                    {booking.status}
                  </p>
                </div>
                <div className="flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p className="truncate">
                    {booking.bookedByName} ({booking.bookedByEmail})
                  </p>
                </div>
                <div className="flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p className="whitespace-nowrap">
                    <time dateTime={booking.start}>
                      {maskDate(booking.start)}
                    </time>
                  </p>
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <title>Separator</title>
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p className="truncate">
                    {maskTimeRange(booking.start, booking.end)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-normal text-xs text-gray-500">
                  Received {maskDurationSince(booking.createdAt)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
