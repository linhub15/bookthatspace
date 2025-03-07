import { rootRoute } from "@/.router";
import { createRoute } from "@tanstack/react-router";
import { ViewBooking } from "./view.$booking_id";

const renterPortalOutlet = createRoute({
  getParentRoute: () => rootRoute,
  path: "p",
});

export const viewBookingRoute = createRoute({
  getParentRoute: () => renterPortalOutlet,
  path: "$booking_id",
  component: ViewBooking,
});

export const renterPortalRoutes = renterPortalOutlet.addChildren([
  viewBookingRoute,
]);
