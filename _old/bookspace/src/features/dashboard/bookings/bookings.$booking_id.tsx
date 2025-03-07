import { BackButton } from "@/components/buttons/back_button";
import { Card } from "@/components/card";
import { maskDate, maskDurationSince, maskTimeRange } from "@/lib/masks/masks";
import { Tables } from "@/clients/supabase";
import { MapPinIcon, UserCircleIcon } from "@heroicons/react/24/outline";

import { Link } from "@tanstack/react-router";
import { bookingRoute, bookingsRoute } from "../dashboard.routes";
import { useRoom } from "../rooms/hooks";
import { PaperClipIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useGetBooking } from "./hooks";

export function Booking() {
  const { booking_id } = bookingRoute.useParams();
  const { data: booking } = useGetBooking(booking_id);
  return (
    <>
      <div className="py-4">
        <Link className="w-fit" to={bookingsRoute.to}>
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
  const { data: room } = useRoom(booking.room_id);

  return (
    <div className="lg:col-start-3 lg:row-end-1 max-w-xs">
      <h2 className="sr-only">Summary</h2>
      <Card>
        <dl className="flex flex-wrap">
          <div className="flex py-6 w-full justify-between items-start">
            <div className="flex flex-col pl-6">
              <h3 className="font-medium leading-6 text-gray-900">
                {maskDate(booking.start)}
              </h3>
              <span className="text-sm leading-6 text-muted">
                {maskTimeRange(booking.start, booking.end)}
              </span>
              <span className="text-sm leading-6 text-muted">
                Reveived {maskDurationSince(booking.created_at)}
              </span>
            </div>
            <div className="px-6">
              <dt className="sr-only">Status</dt>
              <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                {booking.status}
              </dd>
            </div>
          </div>
          <div className="flex flex-col w-full py-6 gap-y-3 border-t border-gray-900/5">
            <h3 className="px-6 text-sm font-semibold leading-6 text-gray-900">
              Event Details
            </h3>
            <div className="flex w-full flex-none gap-x-4 px-6">
              <dt className="flex-none">
                <span className="sr-only">Client name</span>
                <UserCircleIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm leading-6 text-gray-500">
                {booking.booked_by_name} ({booking.booked_by_email})
              </dd>
            </div>
            <div className="flex w-full flex-none gap-x-4 px-6">
              <dt className="flex-none">
                <span className="sr-only">Room</span>
                <MapPinIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm leading-6 text-gray-500">
                {room?.name}
              </dd>
            </div>
          </div>
        </dl>
        {booking.description && (
          <div className="border-t border-gray-900/5 px-6 py-6">
            <h3 className="text-sm font-semibold leading-6 text-gray-900">
              Additional information
            </h3>
            <p>
              {booking.description}
            </p>
          </div>
        )}
        <div className="border-t border-gray-900/5 px-6 py-6">
          <ul
            role="list"
            className="divide-y divide-gray-100 rounded-md border border-gray-200"
          >
            <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
              <div className="flex w-0 flex-1 items-center">
                <PaperClipIcon className="h-5 w-5 shrink-0 text-gray-400" />

                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                  <span className="truncate font-medium">
                    resume_back_end_developer.pdf
                  </span>
                </div>
              </div>
              <div className="ml-4 shrink-0">
                <button
                  className="font-medium text-red-600 hover:text-red-500"
                  type="button"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </li>
            <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
              <div className="flex w-0 flex-1 items-center">
                <PaperClipIcon className="h-5 w-5 shrink-0 text-gray-400" />
                <div className="ml-3 flex min-w-0 flex-1 gap-2">
                  <span className="truncate font-medium">
                    coverletter_back_end_developer.pdf
                  </span>
                </div>
              </div>
              <div className="ml-4 shrink-0">
                <button
                  className="font-medium text-red-600 hover:text-red-500"
                  type="button"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
