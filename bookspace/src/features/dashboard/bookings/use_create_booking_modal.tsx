import { Modal } from "@/components/modal";
import { useState } from "react";
import { InternalBookingForm } from "./internal_booking_form";
import { useFacility, useProfile } from "../../hooks";

export function useCreateBookingModal() {
  const [open, setOpen] = useState(false);
  const facility = useFacility();
  const profile = useProfile();
  const modal = () => {
    return (
      <Modal open={open} onDismiss={() => {}}>
        {facility.data && profile.data &&
          (
            <InternalBookingForm
              facilityId={facility.data.id}
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
