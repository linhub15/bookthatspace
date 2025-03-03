import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/rooms/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>RoomId</div>;
}
