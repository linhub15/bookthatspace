import { Route } from "@tanstack/react-router";
import { rootRoute } from "../app.router";
import { Profile } from "./profile/profile";
import { roomRoute } from "./rooms/[roomId]";
import { Bookings } from "./bookings/bookings";
import { authGuard } from "../auth/auth.routes";
import { Widget } from "./widget/widget";
import { bookingRoute } from "./bookings/[bookingId]";
import { Dashboard } from "./dashboard";
import { Rooms } from "./rooms/rooms";
import { z } from "zod";
import { QueryClient } from "@tanstack/react-query";
import { userQueryOptions } from "../auth/user_query_options";
import { registeredGuard } from "../profile/registered.guard";

export const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "dashboard",
  component: Dashboard,
  beforeLoad: async (ctx) => {
    await authGuard(ctx.location.pathname);
    await registeredGuard();
  },
});

const roomsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "rooms",
  component: Rooms,
});

export const bookingsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "bookings",
  validateSearch: z.object({ tab: z.string().optional() }),
  component: Bookings,
});

const widgetRoute = new Route({
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
  roomsRoute,
  roomRoute,
  bookingsRoute,
  bookingRoute,
  widgetRoute,
  profileRoute,
]);
