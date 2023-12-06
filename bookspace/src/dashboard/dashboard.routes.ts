import { Route } from "@tanstack/react-router";
import { Dashboard } from "./dashboard";
import { Rooms } from "./rooms/rooms";
import { rootRoute } from "../app.router";
import { Profile } from "./profile/profile";
import { Room } from "./rooms/room";
import { Bookings } from "./bookings/bookings";
import { authGuard } from "../auth/auth.routes";
import { Widget } from "./widget/widget";
import { supabase } from "../supabase";

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "dashboard",
  component: Dashboard,
  beforeLoad: async (ctx) => {
    await authGuard(ctx.location.pathname);
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

const bookingsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "bookings",
  component: Bookings,
});

const widgetRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: "widget",
  component: (ctx) => Widget({ profileId: ctx.useLoaderData().data?.user?.id }),
  loader: () => {
    return supabase.auth.getUser();
  },
});

const profileRoute = new Route({
  id: "profile",
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
  widgetRoute,
  profileRoute,
]);
