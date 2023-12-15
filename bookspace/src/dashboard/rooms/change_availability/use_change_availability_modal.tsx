import { Modal } from "@/src/components/modal";
import { useState } from "react";
import { AvailabilityForm } from "./availability_form";
import { useChangeAvailability, useRoom, useRoomAvailability } from "../hooks";

type Props = {
  roomId: string;
};

export function useChangeAvailabilityModal(props: Props) {
  const [open, setOpen] = useState(false);
  const { data: room } = useRoom(props.roomId);
  const availability = useRoomAvailability(props.roomId);
  const changeAvailability = useChangeAvailability({ roomId: props.roomId });

  const modal = () => {
    return (
      <Modal open={open} onDismiss={() => {}}>
        <div className="pb-8">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Change Availability
          </h3>
          <p className="text-sm text-gray-500">
            {room?.name}
          </p>
        </div>
        <AvailabilityForm
          roomId={props.roomId}
          values={availability.data || []}
          onSubmit={async (value) => {
            await changeAvailability.mutateAsync(value, {
              onSuccess: () => setOpen(false),
            });
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    );
  };

  const openModal = () => setOpen(true);

  return { Modal: modal, open: openModal };
}
