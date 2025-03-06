import { BackButton } from "@/components/buttons/back_button";
import { Card } from "@/components/card";
import { maskDate, maskDurationSince, maskTimeRange } from "@/lib/masks/masks";
import { Tables } from "@/clients/supabase";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import { Link } from "@tanstack/react-router";
import { bookingRequestRoute, bookingRequestsRoute } from "../dashboard.routes";
import { useRoom } from "../rooms/hooks";
import { PaperClipIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useRoomBooking } from "../bookings/hooks";
import { Feed } from "@/components/feed";
import { Temporal } from "@js-temporal/polyfill";
import { useRejectBookingModal } from "./use_reject_booking_modal";
import { useAcceptBooking } from "./use_accept_booking";
import { SubmitButton } from "@/components/buttons/submit_button";

export function BookingRequest() {
  const { booking_id } = bookingRequestRoute.useParams();
  const { data: booking } = useRoomBooking(booking_id);
  return (
    <>
      <div className="py-4">
        <Link className="w-fit" to={bookingRequestsRoute.to}>
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
  const rejectBookingModal = useRejectBookingModal(booking.id);
  const acceptBooking = useAcceptBooking();

  const accept = async () => {
    await acceptBooking.mutateAsync({ booking_id: booking.id });
  };

  return (
    <>
      <rejectBookingModal.Modal />
      <div className="lg:col-start-3 lg:row-end-1 w-full sm:max-w-lg">
        <h2 className="sr-only">Summary</h2>
        <Card>
          <dl className="flex flex-wrap">
            <div className="flex py-6 w-full justify-between">
              <div className="flex-col pl-6">
                <dt className="">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    Booking Request
                  </h3>
                </dt>
                <dd className="text-sm leading-6 text-gray-500">
                  Reveived {maskDurationSince(booking.created_at)}
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
                  <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  <div className="ml-3 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">
                      rental_contract.pdf
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
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
          {booking.status === "needs_approval" && (
            <div className="pt-10 grid sm:grid-flow-row-dense sm:grid-cols-2 gap-3 border-t border-gray-900/5 px-6 py-6">
              <SubmitButton
                type="button"
                onClick={() => accept()}
                pending={acceptBooking.isPending}
              >
                Accept
              </SubmitButton>
              <button
                className="flex w-full border border-gray-300 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={rejectBookingModal.open}
              >
                Reject
              </button>
            </div>
          )}

          {booking.status === "active" && (
            <div className="px-6 py-4">
              <Feed
                timeline={[{
                  label: "Booking requested",
                  date: Temporal.Instant.from(booking.created_at)
                    .toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                    }),
                  status: "done",
                }, {
                  label: "Approved",
                  date: Temporal.Now.instant().toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                  }),
                  status: "done",
                }, {
                  label: "Waiting payment",
                  date: "",
                  status: "in_progress",
                }, {
                  label: "Finalized",
                  date: "",
                  status: "not_started",
                }]}
              />
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
