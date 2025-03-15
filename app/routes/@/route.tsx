import { AnalyticsProvider } from "@/lib/analytics/analytics.provider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/@")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <AnalyticsProvider>
        <Outlet />
      </AnalyticsProvider>
    </div>
  );
}
