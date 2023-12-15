import { Modal } from "@/src/components/modal";
import { useState } from "react";

export function useEditRoomModal() {
  const [open, setOpen] = useState(false);

  const modal = () => {
    return (
      <Modal open={open} onDismiss={() => {}}>
        Edit the room formasd
      </Modal>
    );
  };

  return { Modal: modal, open: () => setOpen(true) };
}

function EditRoomForm() {
  // todo(hubert): implement
}
