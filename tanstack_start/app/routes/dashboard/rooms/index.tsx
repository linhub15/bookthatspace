import { Rooms } from "@/app/features/dashboard/rooms/rooms/rooms";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/rooms/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Rooms />
    </div>
  );
}
