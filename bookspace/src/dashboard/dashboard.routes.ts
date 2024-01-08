import { Route } from "@tanstack/react-router";
import { rootRoute } from "../app.router";
import { Profile } from "./profile/profile";
import { Room } from "./rooms/[roomId]";
import { Bookings } from "./bookings/bookings";
import { authGuard } from "../auth/auth.routes";
import { Widget } from "./widget/widget";
import { Booking } from "./bookings/[bookingId]";
import { Dashboard } from "./dashboard";
import { Rooms } from "./rooms/rooms";
import { z } from "zod";
import { QueryClient } from "@tanstack/react-query";
import { userQueryOptions } from "../auth/user_query_options";

export const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "dashboard",
  component: Dashboard,
  beforeLoad: async (ctx) => {
    await authGuard(ctx.location.pathname);
  },
});

export const roomsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "rooms",
});

export const roomsIndexRoute = new Route({
  getParentRoute: () => roomsRoute,
  path: "/",
  component: Rooms,
});

export const roomRoute = new Route({
  getParentRoute: () => roomsRoute,
  path: "$roomId",
  component: Room,
});

export const bookingsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "bookings",
});

export const bookingsIndexRoute = new Route({
  getParentRoute: () => bookingsRoute,
  path: "/",
  validateSearch: z.object({ tab: z.string().optional() }),
  component: Bookings,
});

export const bookingRoute = new Route({
  getParentRoute: () => bookingsRoute,
  path: "$bookingId/view",
  component: Booking,
});

export const widgetRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "widget",
  loader: () => (new QueryClient()).ensureQueryData(userQueryOptions),
  component: Widget,
});

const profileRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "profile",
  component: Profile,
  beforeLoad: async (ctx) => {
    await authGuard(ctx.location.pathname);
  },
});

export const dashboardRoutes = dashboardRoute.addChildren([
  roomsRoute.addChildren([roomsIndexRoute, roomRoute]),
  bookingsRoute.addChildren([bookingsIndexRoute, bookingRoute]),
  widgetRoute,
  profileRoute,
]);
