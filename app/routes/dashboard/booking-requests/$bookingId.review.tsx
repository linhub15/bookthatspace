import { BackButton } from "@/app/components/buttons/back_button";
import { SubmitButton } from "@/app/components/buttons/submit_button";
import { Card } from "@/app/components/card";
import { Feed } from "@/app/components/feed";
import type { RoomBookingSelect } from "@/app/db/types";
import { RejectBookingModalButton } from "@/app/features/booking_management/reject_booking_modal_button";
import { useAcceptBooking } from "@/app/features/booking_management/hooks/use_accept_booking";
import { useRoomBooking } from "@/app/features/booking_management/hooks/use_room_booking";
import { useRoom } from "@/app/features/facility_management/rooms/hooks/use_rooms";
import { maskDate, maskDurationSince, maskTimeRange } from "@/lib/masks/masks";
import { PaperClipIcon, TrashIcon } from "@heroicons/react/16/solid";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Temporal } from "temporal-polyfill";
import { Route as bookingRequestsRoute } from "./index";

export const Route = createFileRoute(
  "/dashboard/booking-requests/$bookingId/review",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { bookingId } = Route.useParams();
  const { data } = useRoomBooking(bookingId);
  return (
    <>
      <div className="py-4">
        <Link className="w-fit" to={bookingRequestsRoute.to}>
          <BackButton />
        </Link>
      </div>
      <div>
        {data && <BookingCard booking={data.booking} />}
      </div>
    </>
  );
}

function BookingCard({ booking }: { booking: RoomBookingSelect }) {
  const { data: room } = useRoom(booking.roomId);
  const acceptBooking = useAcceptBooking();

  const accept = async () => {
    await acceptBooking.mutateAsync({ roomBookingId: booking.id });
  };

  return (
    <>
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
                  Reveived {maskDurationSince(booking.createdAt)}
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
                  {booking.bookedByName} ({booking.bookedByEmail})
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
            <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
              <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div className="flex w-0 flex-1 items-center">
                  <PaperClipIcon className="h-5 w-5 shrink-0 text-gray-400" />
                  <div className="ml-3 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">
                      rental_contract.pdf
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
          {booking.status === "needs_approval" && (
            <div className="pt-10 grid sm:grid-flow-row-dense sm:grid-cols-2 gap-3 border-t border-gray-900/5 px-6 py-6">
              <SubmitButton
                type="button"
                onClick={accept}
                pending={acceptBooking.isPending}
              >
                Accept
              </SubmitButton>
              <RejectBookingModalButton bookingId={booking.id} />
            </div>
          )}

          {booking.status === "active" && (
            <div className="px-6 py-4">
              <Feed
                timeline={[{
                  label: "Booking requested",
                  date: Temporal.Instant.from(booking.createdAt.toISOString())
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
