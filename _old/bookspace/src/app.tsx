import { Navigate } from "@tanstack/react-router";
import { bookingsRoute } from "./features/dashboard/dashboard.routes";

export function App() {
  return (
    <div>
      <Navigate to={bookingsRoute.to} startTransition />
    </div>
  );
}
