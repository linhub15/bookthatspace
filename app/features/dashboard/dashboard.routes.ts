/** @deprecated replaced with file-routing */

import { createRoute } from "@tanstack/react-router";
import { Profile } from "./profile/profile";
import { Room } from "./facility_management/rooms/rooms.$room_id";
import { Bookings } from "./bookings/bookings";
import { authGuard } from "../../auth/auth.routes";
import { Booking } from "./bookings/bookings.$booking_id";
import { Dashboard } from "./dashboard";
import { Rooms } from "./facility_management/rooms/rooms";
import { z } from "zod";
import { QueryClient } from "@tanstack/react-query";
import { userQueryOptions } from "../../auth/user_query_options";
import { WidgetIndex } from "./widget/widget";
import { BookingRequests } from "./booking_requests/booking_requests";
import { BookingRequest } from "./booking_requests/booking_requests.$booking_id";
import { Route } from "@/app/routes/__root";

export const dashboardRoute = createRoute({
  getParentRoute: () => Route,
  path: "dashboard",
  component: Dashboard,
  beforeLoad: async (ctx) => {
    await authGuard(ctx.location.pathname);
  },
});

export const roomsOutlet = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "rooms",
});

export const roomsIndexRoute = createRoute({
  getParentRoute: () => roomsOutlet,
  path: "/",
  component: Rooms,
});

export const roomRoute = createRoute({
  getParentRoute: () => roomsOutlet,
  path: "$room_id",
  component: Room,
});

export const bookingRequestsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "booking-requests",
});

export const bookingRequestsIndexRoute = createRoute({
  getParentRoute: () => bookingRequestsRoute,
  path: "/",
  component: BookingRequests,
});

export const bookingRequestRoute = createRoute({
  getParentRoute: () => bookingRequestsRoute,
  path: "$booking_id/review",
  component: BookingRequest,
});

export const bookingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "bookings",
});

export const bookingsIndexRoute = createRoute({
  getParentRoute: () => bookingsRoute,
  path: "/",
  validateSearch: z.object({ tab: z.string().optional() }),
  component: Bookings,
});

export const bookingRoute = createRoute({
  getParentRoute: () => bookingsRoute,
  path: "$booking_id/view",
  component: Booking,
});

export const widgetRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "widget",
  loader: () => (new QueryClient()).ensureQueryData(userQueryOptions),
  component: WidgetIndex,
});

export const profileRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "profile",
  component: Profile,
  beforeLoad: async (ctx) => {
    await authGuard(ctx.location.pathname);
  },
});

export const dashboardRoutes = dashboardRoute.addChildren([
  bookingRequestsRoute.addChildren([
    bookingRequestsIndexRoute,
    bookingRequestRoute,
  ]),
  bookingsRoute.addChildren([bookingsIndexRoute, bookingRoute]),
  roomsOutlet.addChildren([roomsIndexRoute, roomRoute]),
  widgetRoute,
  profileRoute,
]);
