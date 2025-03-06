import { cn } from "@/lib/utils/cn";
import type { LabelHTMLAttributes } from "react";

export function Label(
  props: LabelHTMLAttributes<HTMLLabelElement>,
) {
  return (
    <label
      {...props}
      className={cn(
        "text-sm font-medium leading-6 text-gray-900",
        props.className,
      )}
    />
  );
}
