import { Modal } from "@/src/components/modal";
import { useState } from "react";
import { useDeleteRoom } from "./hooks";

type Props = {
  roomId: string;
  onSuccess: () => void;
};

export function useDeleteRoomModal(props: Props) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteRoom();

  const deleteRoom = async () => {
    await mutation.mutateAsync(props.roomId, {
      onSuccess: () => {
        props.onSuccess();
        setOpen(false);
      },
    });
  };

  const modal = () => {
    //todo(hubert): make this look nice
    return (
      <Modal open={open} onDismiss={() => setOpen(false)}>
        Confirm Delete Modal
        <button onClick={deleteRoom}>Delete</button>
      </Modal>
    );
  };
  return { Modal: modal, open: () => setOpen(true) };
}
