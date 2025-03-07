import { Modal } from "@/app/components/modal";
import { useState } from "react";
import { useRooms } from "../hooks/use_rooms";
import { RoomForm } from "./room_form";

type Props = {
  onSuccess: (roomId: string) => void | Promise<void>;
};

export function CreateRoomModalButton(props: Props) {
  const [open, setOpen] = useState(false);
  const rooms = useRooms();

  return (
    <>
      <button
        className="block text-nowrap bg-blue-600 rounded-sm text-white py-2 px-4 w-fit"
        onClick={() => setOpen(true)}
        type="button"
        disabled={rooms.isLoading}
      >
        Add Room
      </button>

      <Modal
        open={open}
        onDismiss={() => {}}
      >
        <RoomForm
          submitBtnText="Create Room"
          onCancel={() => setOpen(false)}
          onAfterSubmit={(id) => props.onSuccess(id)}
        />
      </Modal>
    </>
  );
}
