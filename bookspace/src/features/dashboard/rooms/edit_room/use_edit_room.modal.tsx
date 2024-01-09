import { Modal } from "@/src/components/modal";
import { useState } from "react";
import { EditRoomForm } from "./edit_room_form";

type Props = {
  roomId: string;
};

export function useEditRoomModal(props: Props) {
  const [open, setOpen] = useState(false);

  const modal = () => {
    return (
      <Modal open={open} onDismiss={() => {}}>
        <EditRoomForm
          roomId={props.roomId}
          onAfterSubmit={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    );
  };

  return { Modal: modal, open: () => setOpen(true) };
}
