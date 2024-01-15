import { rootRoute } from "@/src/app.router";
import { AnonBookingWidget } from "./anon_booking.$facility_id";
import { Route } from "@tanstack/react-router";
import { Confirmation } from "./confirmation";
import { Fragment } from "react";

export const anonBookingRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/s/$facility_id",
});

export const anonBookingIndexRoute = new Route({
  getParentRoute: () => anonBookingRoute,
  path: "/",
  component: Fragment,
});

export const anonBookingWidgetRoute = new Route({
  getParentRoute: () => anonBookingRoute,
  path: "book",
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
  anonBookingWidgetRoute,
  confirmationRoute,
]);
