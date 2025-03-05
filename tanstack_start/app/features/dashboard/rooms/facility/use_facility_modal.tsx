import { Modal, type ModalHook } from "@/app/components/modal";
import { useState } from "react";
import { FacilityForm } from "./facility_form";

export function useFacilityModal(): ModalHook {
  const [open, setOpen] = useState(false);

  const modal = () => {
    return (
      <Modal open={open} onDismiss={() => setOpen(false)}>
        <FacilityForm
          onAfterSubmit={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    );
  };

  return { Modal: modal, open: () => setOpen(true) };
}
