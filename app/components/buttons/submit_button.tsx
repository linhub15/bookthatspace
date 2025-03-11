import { cn } from "@/lib/utils/cn";
import type { ComponentProps, PropsWithChildren } from "react";
import { Spinner } from "../spinner";

type Props = ComponentProps<"button"> & PropsWithChildren & {
  pending?: boolean;
};

export function SubmitButton(props: Props) {
  return (
    <button
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:order-2"
      type={props.type ?? "submit"}
      disabled={props.pending}
      onClick={props.onClick}
    >
      <span
        className={cn({ "hidden": props.pending })}
      >
        {props.children}
      </span>
      {props.pending && <Spinner />}
    </button>
  );
}
