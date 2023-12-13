import { BackButton } from "@/src/components/buttons/back_button";
import { Card } from "@/src/components/card";
import { maskDate, maskTimeRange } from "@/src/masks/masks";
import { supabase } from "@/src/supabase";
import { Enums, Tables } from "@/src/types/supabase_types";
import {
  CalendarDaysIcon,
  ClockIcon,
  CreditCardIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

type Props = {
  bookingId: string;
};

export function Booking(props: Props) {
  const { data: booking } = useGetBooking(props.bookingId);
  return (
    <>
      <div className="py-4">
        <Link className="w-fit" to="/dashboard/bookings">
          <BackButton />
        </Link>
      </div>
      <div>
        {booking && <BookingCard booking={booking} />}
      </div>
    </>
  );
}

function BookingCard({ booking }: { booking: Tables<"room_booking"> }) {
  const approve = useSetBookingStatus(booking.id);
  return (
    <>
      <div className="lg:col-start-3 lg:row-end-1 max-w-xs">
        <h2 className="sr-only">Summary</h2>
        <Card>
          <dl className="flex flex-wrap">
            <div className="flex py-6 w-full justify-between">
              <div className="flex-col pl-6">
                <dt className="text-sm font-semibold leading-6 text-gray-900">
                  Amount
                </dt>
                <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
                  $0.00
                </dd>
              </div>
              <div className="flex-none self-end px-6">
                <dt className="sr-only">Status</dt>
                <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {booking.status}
                </dd>
              </div>
            </div>
            <div className="flex flex-col w-full py-6 gap-y-3 border-t border-gray-900/5">
              <div className="flex w-full flex-none gap-x-4 px-6">
                <dt className="flex-none">
                  <span className="sr-only">Client</span>
                  <UserCircleIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className="text-sm font-medium leading-6 text-gray-900">
                  {booking.booked_by_email}
                </dd>
              </div>
              <div className="flex w-full flex-none gap-x-4 px-6">
                <dt className="flex-none">
                  <span className="sr-only">Booking date</span>
                  <CalendarDaysIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-500">
                  <time dateTime={booking.start}>
                    {maskDate(booking.start)}
                  </time>
                </dd>
              </div>
              <div className="flex w-full flex-none gap-x-4 px-6">
                <dt className="flex-none">
                  <span className="sr-only">Time</span>
                  <ClockIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-500">
                  <time>
                    {maskTimeRange(booking.start, booking.end)}
                  </time>
                </dd>
              </div>
              <div className="flex w-full flex-none gap-x-4 px-6">
                <dt className="flex-none">
                  <span className="sr-only">Credit card status</span>
                  <CreditCardIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-500">
                  Payment or something
                </dd>
              </div>
            </div>
          </dl>
          <div className="border-t border-gray-900/5 px-6 py-6">
            {booking.description}
          </div>
          <div className="border-t border-gray-900/5 px-6 py-6">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              View some documents
              <span aria-hidden="true">{" "}&rarr;</span>
            </a>
          </div>
          <div className="border-t border-gray-900/5 px-6 py-6">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              View calendar
              <span aria-hidden="true">{" "}&rarr;</span>
            </a>
          </div>
          {booking.status === "needs_approval" && (
            <div className="grid gap-4 border-t border-gray-900/5 px-6 py-6">
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => approve.mutate({ status: "active" })}
              >
                Approve
              </button>

              <button
                className="flex w-full border border-gray-300 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => approve.mutate({ status: "rejected" })}
              >
                Reject
              </button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function useGetBooking(bookingId: string) {
  return useQuery({
    queryKey: ["room_bookings", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase.from("room_booking").select("*")
        .eq(
          "id",
          bookingId,
        );

      if (error) {
        alert(error.message);
        return;
      }

      return data.at(0);
    },
  });
}

function useSetBookingStatus(bookingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      args: { status: Enums<"room_booking_status"> },
    ) => {
      const { error } = await supabase.from("room_booking").update({
        status: args.status,
      }).eq(
        "id",
        bookingId,
      );

      if (error) {
        alert(error.message);
      }

      queryClient.invalidateQueries({ queryKey: ["room_bookings"] });
    },
  });
}
