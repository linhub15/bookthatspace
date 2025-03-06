import { cn } from "@/lib/utils/cn";
import type { LabelHTMLAttributes } from "react";

export function Label(
  props: LabelHTMLAttributes<HTMLLabelElement>,
) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label
      {...props}
      className={cn(
        "text-sm font-medium leading-6 text-gray-900",
        props.className,
      )}
    />
  );
}
