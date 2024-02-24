import { rootRoute } from "@/src/app.router";
import { createRoute } from "@tanstack/react-router";
import { AnonBookingWidget } from "./anon_booking.$facility_id";
import { Confirmation } from "./confirmation";
import { Fragment } from "react";

export const anonBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/widget/$facility_id",
});

export const anonBookingIndexRoute = createRoute({
  getParentRoute: () => anonBookingRoute,
  path: "/",
  component: Fragment,
});

export const anonBookingWidgetRoute = createRoute({
  getParentRoute: () => anonBookingRoute,
  path: "book",
  component: AnonBookingWidget,
});

export const confirmationRoute = createRoute({
  getParentRoute: () => anonBookingRoute,
  path: "confirmation",
  component: Confirmation,
  validateSearch: (search: Record<string, unknown>): { booking_id: string } => {
    return { booking_id: search.booking_id as string || "" };
  },
});

export const anonBookingRoutes = anonBookingRoute.addChildren([
  anonBookingIndexRoute,
  anonBookingWidgetRoute,
  confirmationRoute,
]);
