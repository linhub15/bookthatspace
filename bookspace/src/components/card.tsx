import { PropsWithChildren } from "react";

export function Card(props: PropsWithChildren) {
  return (
    <div className="w-full overflow-hidden bg-white shadow sm:rounded-lg">
      {props.children}
    </div>
  );
}
