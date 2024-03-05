import { rootRoute } from "@/src/app.router";
import { createRoute } from "@tanstack/react-router";
import { BookingWidget } from "./booking.$facility_id";
import { AvailabilityWidget } from "./availability.$facility_id";
import { Confirmation } from "./confirmation.$booking_id";

export const publicOutlet = createRoute({
  getParentRoute: () => rootRoute,
  path: "/widget/$facility_id",
});

export const publicAvailabilityRoute = createRoute({
  getParentRoute: () => publicOutlet,
  path: "/",
  component: AvailabilityWidget,
});

export const publicBookingRoute = createRoute({
  getParentRoute: () => publicOutlet,
  path: "book",
  component: BookingWidget,
});

export const confirmationRoute = createRoute({
  getParentRoute: () => publicOutlet,
  path: "confirmation",
  component: Confirmation,
  validateSearch: (search: Record<string, unknown>): { booking_id: string } => {
    return { booking_id: search.booking_id as string || "" };
  },
});

export const publicBookingRoutes = publicOutlet.addChildren([
  publicAvailabilityRoute,
  publicBookingRoute,
  confirmationRoute,
]);
