import { PropsWithChildren } from "react";

export function FormGroup(props: PropsWithChildren) {
  return (
    <div className="space-y-2">
      {props.children}
    </div>
  );
}
