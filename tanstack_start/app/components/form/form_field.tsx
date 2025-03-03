import { cn } from "@/lib/utils/cn";
import type { ComponentProps } from "react";

export function FormField(props: ComponentProps<"div">) {
  return (
    <div className={cn("space-y-2", props.className)}>
      {props.children}
    </div>
  );
}
