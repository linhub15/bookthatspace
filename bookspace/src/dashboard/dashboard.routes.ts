import { redirect, Route } from "@tanstack/react-router";
import { Dashboard } from "./dashboard";
import { Rooms } from "./rooms/rooms";
import { rootRoute } from "../app.router";
import { Profile } from "./profile/profile";
import { checkAuthenticated } from "../auth/use_authenticated.signal";
import { Room } from "./rooms/room";
import { Bookings } from "./bookings/bookings";

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "dashboard",
  component: Dashboard,
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

const profileRoute = new Route({
  id: "profile",
  getParentRoute: () => dashboardRoute,
  path: "profile",
  component: Profile,
  beforeLoad: async () => {
    const authed = await checkAuthenticated();
    if (!authed) {
      throw redirect({
        to: "/login",
        search: { redirect: "/dashboard/profile" },
      });
    }
  },
});

export const dashboardRoutes = dashboardRoute.addChildren([
  roomsRoute,
  roomRoute,
  bookingsRoute,
  profileRoute,
]);
