import { Modal } from "@/app/components/modal";
import { useState } from "react";
import { RoomForm } from "./room_form";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type Props = {
  roomId: string;
  onSuccess?: () => void | Promise<void>;
};

export function EditRoomModalButton(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
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
        <RoomForm
          roomId={props.roomId}
          submitBtnText="Save"
          onAfterSubmit={async () => {
            props.onSuccess?.();
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
