import { Modal } from "@/app/components/modal";
import { useState } from "react";
import { RejectBookingForm } from "./reject_booking_form";

type Props = {
  bookingId: string;
};

export function RejectBookingModalButton(props: Props) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <button
        className="flex w-full border border-gray-300 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-xs hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => setOpen(true)}
        type="button"
      >
        Reject
      </button>
      <Modal open={open} onDismiss={close}>
        <RejectBookingForm
          bookingId={props.bookingId}
          onAfterSubmit={close}
          onCancel={close}
        />
      </Modal>
    </>
  );
}
