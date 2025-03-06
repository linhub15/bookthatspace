import { Modal } from "@/app/components/modal";
import { type PropsWithChildren, useState } from "react";
import { FacilityForm } from "./facility_form";

type Props = {
  className: string;
} & PropsWithChildren;

export function FacilityFormModalButton(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={props.className}
        type="button"
        onClick={() => setOpen(true)}
      >
        {props.children}
      </button>

      <Modal open={open} onDismiss={() => setOpen(false)}>
        <FacilityForm
          onAfterSubmit={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
