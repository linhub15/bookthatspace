import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/rooms/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = Route.useParams();
  return <div>{roomId}</div>;
}
