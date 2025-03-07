import { Dialog, DialogPanel } from "@headlessui/react";
import clsx from "clsx";
import type { JSX, PropsWithChildren } from "react";

type Props = {
  open: boolean;
  /** Called when backdrop is clicked. Use `() => {}` to disable backdrop close */
  onDismiss: () => void;
} & PropsWithChildren;

export function Modal(
  { open, onDismiss, children }: Props,
) {
  return (
    <Dialog
      open={open}
      as="div"
      className={clsx([
        "relative z-40",
        "data-closed:opacity-0",
      ])}
      onClose={onDismiss}
      transition
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-40 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative w-full max-w-xl transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
