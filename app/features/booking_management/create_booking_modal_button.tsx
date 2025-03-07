import { Modal } from "@/components/modal";
import { useState } from "react";
import { InternalBookingForm } from "./internal_booking_form";
import { useProfile } from "../profile/use_profile";

export function CreateBookingModalButton() {
  const [open, setOpen] = useState(false);
  const { data: profile } = useProfile();

  return (
    <>
      <button
        className="block text-nowrap bg-blue-600 rounded-sm text-white py-2 px-4 w-fit"
        onClick={() => setOpen(true)}
        type="button"
      >
        Add Booking
      </button>

      <Modal open={open} onDismiss={() => {}}>
        {profile?.user &&
          (
            <InternalBookingForm
              userName={profile.user.name ?? ""}
              userEmail={profile.user.email}
              onAfterSubmit={() => setOpen(false)}
              onCancel={() => setOpen(false)}
            />
          )}
      </Modal>
    </>
  );
}
