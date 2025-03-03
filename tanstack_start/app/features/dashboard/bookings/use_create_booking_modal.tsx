import { Modal } from "@/app/components/modal";
import { useState } from "react";
import { InternalBookingForm } from "./internal_booking_form";
import { useProfile } from "../../hooks";

export function useCreateBookingModal() {
  const [open, setOpen] = useState(false);
  const profile = useProfile();
  const modal = () => {
    return (
      <Modal open={open} onDismiss={() => {}}>
        {profile.data &&
          (
            <InternalBookingForm
              userName={profile.data.name ?? ""}
              userEmail={profile.data.email}
              onAfterSubmit={() => setOpen(false)}
              onCancel={() => setOpen(false)}
            />
          )}
      </Modal>
    );
  };

  return { Modal: modal, open: () => setOpen(true) };
}
