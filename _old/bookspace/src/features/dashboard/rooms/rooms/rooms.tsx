import { Modal } from "../../../../components/modal";
import { useState } from "react";
import { useRooms } from "../hooks";
import { Link, useNavigate } from "@tanstack/react-router";
import { Tables } from "@/clients/supabase";
import { maskHourlyRate } from "../../../../lib/masks/masks";
import { Card } from "@/components/card";
import { roomRoute } from "../../dashboard.routes";
import { RoomForm } from "./room_form";
import { FacilityCard } from "../facility/facility_card";

export function Rooms() {
  const [open, setOpen] = useState(false);
  const rooms = useRooms();
  const navigate = useNavigate();

  const openNewRoomForm = () => {
    setOpen(true);
  };

  const onRoomCreated = (roomId: string) => {
    setOpen(false);
    navigate({ to: roomRoute.to, params: { room_id: roomId } });
  };

  return (
    <div className="space-y-4">
      <FacilityCard />

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
            <button
              className="block text-nowrap bg-blue-600 rounded-sm text-white py-2 px-4 w-fit"
              onClick={openNewRoomForm}
              disabled={rooms.isLoading}
            >
              Add Room
            </button>
          </div>
        </div>
        <div className="px-4 py-6 sm:px-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rooms.data?.map((room, index) => (
              <RoomCard
                key={index}
                room={room}
              />
            ))}
          </dl>
          <Modal
            open={open}
            onDismiss={() => {}}
          >
            <RoomForm
              submitBtnText="Create Room"
              onCancel={() => setOpen(false)}
              onAfterSubmit={(id) => onRoomCreated(id)}
            />
          </Modal>
        </div>
      </Card>
    </div>
  );
}

function RoomCard(props: { room: Tables<"room"> }) {
  return (
    <Link to={roomRoute.to} params={{ room_id: props.room.id }}>
      <div className="rounded-lg shadow-xs ring-1 ring-gray-900/5 select-none">
        <div className="flex w-full px-6 py-6 justify-between align-top">
          <div className="flex-auto">
            <dt className="text-sm font-semibold leading-6 text-gray-900">
              {props.room.name}
            </dt>
            <dd className="mt-1 text-base text-gray-500">
              {maskHourlyRate(props.room.hourly_rate)}
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
