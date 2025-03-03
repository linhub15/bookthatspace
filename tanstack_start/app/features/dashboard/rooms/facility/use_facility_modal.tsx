import { Modal, type ModalHook } from "@/app/components/modal";
import { useState } from "react";
import { useProfile } from "../../../hooks";
import { FacilityForm } from "./facility_form";

export function useFacilityModal(): ModalHook {
  const [open, setOpen] = useState(false);
  const { data: profile } = useProfile();

  const modal = () => {
    return (
      <Modal open={open} onDismiss={() => setOpen(false)}>
        {profile?.id && (
          <FacilityForm
            profileId={profile?.id}
            onAfterSubmit={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )}
      </Modal>
    );
  };

  return { Modal: modal, open: () => setOpen(true) };
}
