import { cn } from "@/lib/utils/cn";
import type { ComponentProps } from "react";

export function Card(props: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full bg-white shadow rounded sm:rounded-lg",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
