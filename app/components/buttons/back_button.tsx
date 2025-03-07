import { cn } from "@/lib/utils/cn";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement>;

export function BackButton(props: Props) {
  return (
    <div
      className={cn(
        "rounded-md inline-flex bg-white px-3 py-2 text-sm text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer",
      )}
      {...props}
    >
      <ChevronLeftIcon
        className="-ml-0.5 h-5 w-5"
        aria-hidden="true"
      />
      Back
    </div>
  );
}
