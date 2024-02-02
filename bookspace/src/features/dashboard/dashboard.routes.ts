import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../app.router";
import { Profile } from "./profile/profile";
import { Room } from "./rooms/rooms.$room_id";
import { Bookings } from "./bookings/bookings";
import { authGuard } from "../../auth/auth.routes";
import { Booking } from "./bookings/bookings.$booking_id";
import { Dashboard } from "./dashboard";
import { Rooms } from "./rooms/rooms";
import { z } from "zod";
import { QueryClient } from "@tanstack/react-query";
import { userQueryOptions } from "../../auth/user_query_options";
import { WidgetIndex } from "./widget/widget";
import { BookingRequests } from "./booking_requests/booking_requests";
import { BookingRequest } from "./booking_requests/booking_requests.$booking_id";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "dashboard",
  component: Dashboard,
  beforeLoad: async (ctx) => {
    await authGuard(ctx.location.pathname);
  },
});

export const roomsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "rooms",
});

export const roomsIndexRoute = createRoute({
  getParentRoute: () => roomsRoute,
  path: "/",
  component: Rooms,
});

export const roomRoute = createRoute({
  getParentRoute: () => roomsRoute,
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
  roomsRoute.addChildren([roomsIndexRoute, roomRoute]),
  widgetRoute,
  profileRoute,
]);
