import { Link, Route, useNavigate } from "@tanstack/react-router";
import { useRoom, useRoomAvailability } from "./hooks";
import { BackButton } from "@/src/components/buttons/back_button";
import { Card } from "@/src/components/card";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { maskHourlyRate } from "@/src/masks/masks";
import { Temporal } from "@js-temporal/polyfill";
import { useWeekCalendar } from "./use_week_calendar";

import { useChangeAvailabilityModal } from "./change_availability/use_change_availability_modal";
import { useDeleteRoomModal } from "./use_delete_room_modal";
import { useEditRoomModal } from "./edit_room/use_edit_room.modal";
import { dashboardRoute } from "../dashboard.routes";

export const roomRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "rooms/$roomId",
  component: Room,
});

function Room() {
  const { roomId } = roomRoute.useParams();
  const navigate = useNavigate();

  const editRoom = useEditRoomModal({ roomId: roomId });
  const deleteRoom = useDeleteRoomModal({
    roomId: roomId,
    onSuccess: () => {
      navigate({ to: "/dashboard/rooms" });
    },
  });

  const availability = useRoomAvailability(roomId);

  const calendar = useWeekCalendar();

  const changeAvailability = useChangeAvailabilityModal({
    roomId: roomId,
  });

  const { data: room } = useRoom(roomId);
  if (!room) return <div>loading...</div>;

  return (
    <>
      <div className="space-y-4">
        <Link className="w-fit" to="/dashboard/rooms">
          <BackButton />
        </Link>

        <Card>
          <div className="bg-white px-4 py-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  {room.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {room.address}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-4">
                <button
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  type="button"
                  onClick={() => editRoom.open()}
                >
                  <PencilSquareIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Edit</span>
                </button>
                <button
                  className="relativeinline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-800 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                  type="button"
                  onClick={() => deleteRoom.open()}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 pb-8 sm:px-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Hourly Rate
                </dt>
                <dd className="leading-6 text-gray-700">
                  {maskHourlyRate(room.hourly_rate)}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Room Capacity
                </dt>
                <dd className="leading-6 text-gray-700">
                  {room.max_capacity}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Description
                </dt>
                <dd className="leading-6 text-gray-700">
                  {room.description}
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card>
          <div className="bg-white px-4 py-5 sm:px-6 border-b border-b-gray-200">
            <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Availability
              </h3>
              <div className="flex flex-shrink-0 gap-4">
                <button
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  type="button"
                  onClick={() => changeAvailability.open()}
                >
                  <PencilSquareIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>

          {!!availability.data?.length && (
            <calendar.WeekView>
              {availability.data?.map((a, index) => (
                <calendar.Event
                  key={index}
                  weekday={a.day_of_week}
                  start={Temporal.PlainTime.from(a.start)}
                  end={Temporal.PlainTime.from(a.end)}
                />
              ))}
            </calendar.WeekView>
          )}
        </Card>
      </div>
      <editRoom.Modal />
      <deleteRoom.Modal />
      <changeAvailability.Modal />
    </>
  );
}
