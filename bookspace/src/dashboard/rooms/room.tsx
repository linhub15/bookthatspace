import { Link, useNavigate } from "@tanstack/react-router";
import { useDeleteRoom, useRoomAvailability, useRooms } from "./hooks";
import { BackButton } from "@/src/components/buttons/back_button";
import { Card } from "@/src/components/card";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { maskHourlyRate } from "@/src/masks/masks";
import { Temporal } from "@js-temporal/polyfill";
import { useWeekCalendar } from "./use_week_calendar";

type Props = {
  roomId: string;
};

export function Room(props: Props) {
  const navigate = useNavigate();

  const rooms = useRooms();
  const room = rooms.data?.find((room) => room.id === props.roomId);
  const deleteRoom = useDeleteRoom();
  const availability = useRoomAvailability(props.roomId);

  const calendar = useWeekCalendar();

  if (!room) return <div>loading...</div>;

  const onDelete = async () => {
    await deleteRoom.mutateAsync(room.id, {
      onSuccess: () => navigate({ to: "/dashboard/rooms" }),
    });
  };

  return (
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
                type="button"
                className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilSquareIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Edit</span>
              </button>
              <button
                type="button"
                className="relativeinline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-800 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                onClick={onDelete}
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
                Cost
              </dt>
              <dd className="leading-6 text-gray-700">
                {maskHourlyRate(room.hourly_cost)}
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
                About
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
                type="button"
                className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
        <calendar.WeekView>
          {availability.data && (
            availability.data?.map((a) => (
              <calendar.Event
                weekday={a.day_of_week}
                start={Temporal.PlainTime.from(a.start)}
                end={Temporal.PlainTime.from(a.end)}
              />
            ))
          )}
        </calendar.WeekView>
      </Card>
    </div>
  );
}
