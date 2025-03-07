import { Modal } from "@/components/modal";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { RoomAvailabilityForm } from "./room_availability_form";
import { useRoomAvailability } from "../hooks/use_room_availability";
import { useRoom } from "../hooks/use_rooms";
import { useChangeAvailability } from "../hooks/use_update_room_availability";

type Props = {
  roomId: string;
};

export function ChangeRoomAvailabilityModalButton(props: Props) {
  const [open, setOpen] = useState(false);
  const { data: room } = useRoom(props.roomId);
  const availability = useRoomAvailability(props.roomId);
  const changeAvailability = useChangeAvailability({ roomId: props.roomId });

  return (
    <div className="flex shrink-0 gap-4">
      <button
        className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        type="button"
        onClick={() => setOpen(true)}
      >
        <PencilSquareIcon
          className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <span>Edit</span>
      </button>
      <Modal open={open} onDismiss={() => {}}>
        <div className="pb-8">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Change Availability
          </h3>
          <p className="text-sm text-gray-500">
            {room?.name}
          </p>
        </div>
        <RoomAvailabilityForm
          roomId={props.roomId}
          values={availability.data || []}
          onSubmit={async (value) => {
            await changeAvailability.mutateAsync({
              roomId: props.roomId,
              next: value,
            }, {
              onSuccess: () => setOpen(false),
            });
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </div>
  );
}
