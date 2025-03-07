import { rootRoute } from "@/.router";
import { createRoute } from "@tanstack/react-router";
import { BookingWidget } from "./booking.$facility_id";
import { FacilityWidget } from "./$facility_id";
import { Confirmation } from "./confirmation.$booking_id";
import { AvailabilityWidget } from "./$facility_id.availability";
import { z } from "zod";

export const publicOutlet = createRoute({
  getParentRoute: () => rootRoute,
  path: "/widget/$facility_id",
});

export const facilityRoute = createRoute({
  getParentRoute: () => publicOutlet,
  path: "/",
  component: FacilityWidget,
});

export const availabilityRoute = createRoute({
  getParentRoute: () => publicOutlet,
  path: "availability",
  validateSearch: z.object({ room_id: z.string() }),
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
  facilityRoute,
  availabilityRoute,
  publicBookingRoute,
  confirmationRoute,
]);
