import { rootRoute } from "@/src/app.router";
import { AnonBookingWidget } from "./[profile_id]";
import { Route } from "@tanstack/react-router";
import { Confirmation } from "./confirmation";

const anonBookingRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "s/$profile_id",
});

const anonBookingIndexRoute = new Route({
  getParentRoute: () => anonBookingRoute,
  path: "/",
  component: AnonBookingWidget,
});

export const confirmationRoute = new Route({
  getParentRoute: () => anonBookingRoute,
  path: "confirmation",
  component: Confirmation,
  validateSearch: (search: Record<string, unknown>): { booking_id: string } => {
    return { booking_id: search.booking_id as string || "" };
  },
});

export const anonBookingRoutes = anonBookingRoute.addChildren([
  anonBookingIndexRoute,
  confirmationRoute,
]);
