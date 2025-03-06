import { Dashboard } from "@/app/features/dashboard/dashboard";
import { getSessionFn } from "@/lib/auth/get_session.fn";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    // todo: consider optimizing this by using a cache to reduce web requests
    const session = await getSessionFn();
    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard />;
}
