import { Modal, type ModalHook } from "@/app/components/modal";
import { useState } from "react";

import { RejectBookingForm } from "./reject_booking_form";

export function useRejectBookingModal(bookingId: string): ModalHook {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const modal = () => (
    <Modal open={open} onDismiss={close}>
      <RejectBookingForm
        bookingId={bookingId}
        onAfterSubmit={close}
        onCancel={close}
      />
    </Modal>
  );

  return { Modal: modal, open: () => setOpen(true) };
}
