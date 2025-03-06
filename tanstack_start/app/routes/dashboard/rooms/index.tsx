import { Card } from "@/app/components/card";
import { FacilityCard } from "@/app/features/dashboard/facility_management/facility/facility_card";
import { CreateRoomModalButton } from "@/app/features/dashboard/facility_management/rooms/components/create_room_modal_button";
import { useRooms } from "@/app/features/dashboard/facility_management/rooms/hooks/use_rooms";
import { maskHourlyRate } from "@/lib/masks/masks";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/rooms/")({
  component: RouteComponent,
});

function RouteComponent() {
  const rooms = useRooms();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <FacilityCard />

      {/* todo: add loading skeletons */}
      {rooms.isPending ? <>loading</> : (
        <Card>
          <div className="px-4 py-6 space-y-4 sm:px-6 sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Rooms
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Rooms and halls available for booking.
              </p>
            </div>
            <div>
              <CreateRoomModalButton
                onSuccess={(id) =>
                  navigate({
                    to: "/dashboard/rooms/$roomId",
                    params: { roomId: id },
                  })}
              />
            </div>
          </div>
          <div className="px-4 py-6 sm:px-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {rooms.data?.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                />
              ))}
            </dl>
          </div>
        </Card>
      )}
    </div>
  );
}
function RoomCard(
  props: { room: { id: string; name: string; hourlyRate: string | null } },
) {
  return (
    <Link to="/dashboard/rooms/$roomId" params={{ roomId: props.room.id }}>
      <div className="rounded-lg shadow-sm ring-1 ring-gray-900/5 select-none">
        <div className="flex w-full px-6 py-6 justify-between align-top">
          <div className="flex-auto">
            <dt className="text-sm font-semibold leading-6 text-gray-900">
              {props.room.name}
            </dt>
            <dd className="mt-1 text-base text-gray-500">
              {maskHourlyRate(props.room.hourlyRate)}
            </dd>
          </div>
          <div className="flex-none">
            <dt className="sr-only">Status</dt>
            <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Active
            </dd>
          </div>
        </div>
      </div>
    </Link>
  );
}
