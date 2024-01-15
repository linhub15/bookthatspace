import { Modal } from "@/src/components/modal";
import { useState } from "react";
import { RoomForm } from "./room_form";

type Props = {
  roomId: string;
};

export function useEditRoomModal(props: Props) {
  const [open, setOpen] = useState(false);

  const modal = () => {
    return (
      <Modal open={open} onDismiss={() => {}}>
        <RoomForm
          roomId={props.roomId}
          submitBtnText="Save"
          onAfterSubmit={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    );
  };

  return { Modal: modal, open: () => setOpen(true) };
}
