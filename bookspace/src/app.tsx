import { Navigate } from "@tanstack/react-router";

export function App() {
  return (
    <div>
      <Navigate to="/dashboard/bookings" startTransition />
    </div>
  );
}
