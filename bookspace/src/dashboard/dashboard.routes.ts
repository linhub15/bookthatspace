import { Route } from "@tanstack/react-router";
import { rootRoute } from "../app.router";
import { Profile } from "./profile/profile";
import { Room } from "./rooms/room";
import { Bookings } from "./bookings/bookings";
import { authGuard } from "../auth/auth.routes";
import { Widget } from "./widget/widget";
import { Booking } from "./bookings/booking";
import { Dashboard } from "./dashboard";
import { Rooms } from "./rooms/rooms";
import { z } from "zod";
import { QueryClient } from "@tanstack/react-query";
import { userQueryOptions } from "../auth/user_query_options";
import { registeredGuard } from "../profile/registered.guard";

const dashboardRoute = new Route({
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

const roomRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "rooms/$roomId",
  component: (ctx) => Room({ roomId: ctx.useParams().roomId }),
});

export const bookingsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "bookings",
  validateSearch: z.object({ tab: z.string().optional() }),
  component: Bookings,
});

const bookingRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "bookings/$bookingId/view",
  component: (ctx) => Booking({ bookingId: ctx.useParams().bookingId }),
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
