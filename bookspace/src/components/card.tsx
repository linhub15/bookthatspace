import { PropsWithChildren } from "react";

export function Card(props: PropsWithChildren) {
  return (
    <div className="w-full bg-white shadow rounded sm:rounded-lg">
      {props.children}
    </div>
  );
}
