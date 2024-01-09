import { Card } from "@/src/components/card";
import { maskDate, maskDurationSince } from "@/src/masks/masks";
import { supabase } from "@/src/supabase";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { bookingRequestRoute } from "../dashboard.routes";
import { cn } from "@/lib/utils/cn";

export function BookingRequests() {
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

function useBookingRequests() {
  const query = useQuery({
    queryKey: ["room_bookings", "requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("room_booking").select(
        "*, room (name)",
      ).eq("status", "needs_approval");

      if (error) {
        alert(error.message);
        return;
      }

      return data;
    },
  });

  return query;
}

function BookingRequestList() {
  const { data } = useBookingRequests();

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
      <ul role="list" className="divide-y divide-gray-100">
        {data?.map((booking) => (
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
                    "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs ring-1 ring-inset",
                  )}
                >
                  {booking.status}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">
                  Booked{" "}
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
                to={bookingRequestRoute.to}
                params={{ booking_id: booking.id }}
                className="hidden w-fit rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                key={booking.id}
              >
                Review
              </Link>

              <span className="font-normal text-xs text-gray-500">
                Received {maskDurationSince(booking.created_at)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
