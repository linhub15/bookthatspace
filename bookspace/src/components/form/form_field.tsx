import { PropsWithChildren } from "react";

export function FormField(props: PropsWithChildren) {
  return (
    <div className="space-y-2">
      {props.children}
    </div>
  );
}
