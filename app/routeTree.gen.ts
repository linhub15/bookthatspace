/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardRouteImport } from './routes/dashboard/route'
import { Route as RouteImport } from './routes/@/route'
import { Route as IndexImport } from './routes/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'
import { Route as DashboardProfileImport } from './routes/dashboard/profile'
import { Route as AuthSignupImport } from './routes/_auth/signup'
import { Route as AuthLoginImport } from './routes/_auth/login'
import { Route as DashboardFacilityIndexImport } from './routes/dashboard/facility/index'
import { Route as DashboardBookingsIndexImport } from './routes/dashboard/bookings/index'
import { Route as DashboardBookingRequestsIndexImport } from './routes/dashboard/booking-requests/index'
import { Route as FacilityIdIndexImport } from './routes/@/$facilityId/index'
import { Route as DashboardFacilityRoomIdImport } from './routes/dashboard/facility/$roomId'
import { Route as BookingSuccessBookingIdImport } from './routes/@/booking-success.$bookingId'
import { Route as FacilityIdBookImport } from './routes/@/$facilityId/book'
import { Route as FacilityIdAvailabilityImport } from './routes/@/$facilityId/availability'
import { Route as DashboardBookingsBookingIdViewImport } from './routes/dashboard/bookings/$bookingId.view'
import { Route as DashboardBookingRequestsBookingIdReviewImport } from './routes/dashboard/booking-requests/$bookingId.review'

// Create/Update Routes

const DashboardRouteRoute = DashboardRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const RouteRoute = RouteImport.update({
  id: '/@',
  path: '/@',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardProfileRoute = DashboardProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const AuthSignupRoute = AuthSignupImport.update({
  id: '/_auth/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  id: '/_auth/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const DashboardFacilityIndexRoute = DashboardFacilityIndexImport.update({
  id: '/facility/',
  path: '/facility/',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardBookingsIndexRoute = DashboardBookingsIndexImport.update({
  id: '/bookings/',
  path: '/bookings/',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardBookingRequestsIndexRoute =
  DashboardBookingRequestsIndexImport.update({
    id: '/booking-requests/',
    path: '/booking-requests/',
    getParentRoute: () => DashboardRouteRoute,
  } as any)

const FacilityIdIndexRoute = FacilityIdIndexImport.update({
  id: '/$facilityId/',
  path: '/$facilityId/',
  getParentRoute: () => RouteRoute,
} as any)

const DashboardFacilityRoomIdRoute = DashboardFacilityRoomIdImport.update({
  id: '/facility/$roomId',
  path: '/facility/$roomId',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const BookingSuccessBookingIdRoute = BookingSuccessBookingIdImport.update({
  id: '/booking-success/$bookingId',
  path: '/booking-success/$bookingId',
  getParentRoute: () => RouteRoute,
} as any)

const FacilityIdBookRoute = FacilityIdBookImport.update({
  id: '/$facilityId/book',
  path: '/$facilityId/book',
  getParentRoute: () => RouteRoute,
} as any)

const FacilityIdAvailabilityRoute = FacilityIdAvailabilityImport.update({
  id: '/$facilityId/availability',
  path: '/$facilityId/availability',
  getParentRoute: () => RouteRoute,
} as any)

const DashboardBookingsBookingIdViewRoute =
  DashboardBookingsBookingIdViewImport.update({
    id: '/bookings/$bookingId/view',
    path: '/bookings/$bookingId/view',
    getParentRoute: () => DashboardRouteRoute,
  } as any)

const DashboardBookingRequestsBookingIdReviewRoute =
  DashboardBookingRequestsBookingIdReviewImport.update({
    id: '/booking-requests/$bookingId/review',
    path: '/booking-requests/$bookingId/review',
    getParentRoute: () => DashboardRouteRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/@': {
      id: '/@'
      path: '/@'
      fullPath: '/@'
      preLoaderRoute: typeof RouteImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardRouteImport
      parentRoute: typeof rootRoute
    }
    '/_auth/login': {
      id: '/_auth/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/signup': {
      id: '/_auth/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof AuthSignupImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/profile': {
      id: '/dashboard/profile'
      path: '/profile'
      fullPath: '/dashboard/profile'
      preLoaderRoute: typeof DashboardProfileImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/'
      fullPath: '/dashboard/'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof DashboardRouteImport
    }
    '/@/$facilityId/availability': {
      id: '/@/$facilityId/availability'
      path: '/$facilityId/availability'
      fullPath: '/@/$facilityId/availability'
      preLoaderRoute: typeof FacilityIdAvailabilityImport
      parentRoute: typeof RouteImport
    }
    '/@/$facilityId/book': {
      id: '/@/$facilityId/book'
      path: '/$facilityId/book'
      fullPath: '/@/$facilityId/book'
      preLoaderRoute: typeof FacilityIdBookImport
      parentRoute: typeof RouteImport
    }
    '/@/booking-success/$bookingId': {
      id: '/@/booking-success/$bookingId'
      path: '/booking-success/$bookingId'
      fullPath: '/@/booking-success/$bookingId'
      preLoaderRoute: typeof BookingSuccessBookingIdImport
      parentRoute: typeof RouteImport
    }
    '/dashboard/facility/$roomId': {
      id: '/dashboard/facility/$roomId'
      path: '/facility/$roomId'
      fullPath: '/dashboard/facility/$roomId'
      preLoaderRoute: typeof DashboardFacilityRoomIdImport
      parentRoute: typeof DashboardRouteImport
    }
    '/@/$facilityId/': {
      id: '/@/$facilityId/'
      path: '/$facilityId'
      fullPath: '/@/$facilityId'
      preLoaderRoute: typeof FacilityIdIndexImport
      parentRoute: typeof RouteImport
    }
    '/dashboard/booking-requests/': {
      id: '/dashboard/booking-requests/'
      path: '/booking-requests'
      fullPath: '/dashboard/booking-requests'
      preLoaderRoute: typeof DashboardBookingRequestsIndexImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/bookings/': {
      id: '/dashboard/bookings/'
      path: '/bookings'
      fullPath: '/dashboard/bookings'
      preLoaderRoute: typeof DashboardBookingsIndexImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/facility/': {
      id: '/dashboard/facility/'
      path: '/facility'
      fullPath: '/dashboard/facility'
      preLoaderRoute: typeof DashboardFacilityIndexImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/booking-requests/$bookingId/review': {
      id: '/dashboard/booking-requests/$bookingId/review'
      path: '/booking-requests/$bookingId/review'
      fullPath: '/dashboard/booking-requests/$bookingId/review'
      preLoaderRoute: typeof DashboardBookingRequestsBookingIdReviewImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/bookings/$bookingId/view': {
      id: '/dashboard/bookings/$bookingId/view'
      path: '/bookings/$bookingId/view'
      fullPath: '/dashboard/bookings/$bookingId/view'
      preLoaderRoute: typeof DashboardBookingsBookingIdViewImport
      parentRoute: typeof DashboardRouteImport
    }
  }
}

// Create and export the route tree

interface RouteRouteChildren {
  FacilityIdAvailabilityRoute: typeof FacilityIdAvailabilityRoute
  FacilityIdBookRoute: typeof FacilityIdBookRoute
  BookingSuccessBookingIdRoute: typeof BookingSuccessBookingIdRoute
  FacilityIdIndexRoute: typeof FacilityIdIndexRoute
}

const RouteRouteChildren: RouteRouteChildren = {
  FacilityIdAvailabilityRoute: FacilityIdAvailabilityRoute,
  FacilityIdBookRoute: FacilityIdBookRoute,
  BookingSuccessBookingIdRoute: BookingSuccessBookingIdRoute,
  FacilityIdIndexRoute: FacilityIdIndexRoute,
}

const RouteRouteWithChildren = RouteRoute._addFileChildren(RouteRouteChildren)

interface DashboardRouteRouteChildren {
  DashboardProfileRoute: typeof DashboardProfileRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
  DashboardFacilityRoomIdRoute: typeof DashboardFacilityRoomIdRoute
  DashboardBookingRequestsIndexRoute: typeof DashboardBookingRequestsIndexRoute
  DashboardBookingsIndexRoute: typeof DashboardBookingsIndexRoute
  DashboardFacilityIndexRoute: typeof DashboardFacilityIndexRoute
  DashboardBookingRequestsBookingIdReviewRoute: typeof DashboardBookingRequestsBookingIdReviewRoute
  DashboardBookingsBookingIdViewRoute: typeof DashboardBookingsBookingIdViewRoute
}

const DashboardRouteRouteChildren: DashboardRouteRouteChildren = {
  DashboardProfileRoute: DashboardProfileRoute,
  DashboardIndexRoute: DashboardIndexRoute,
  DashboardFacilityRoomIdRoute: DashboardFacilityRoomIdRoute,
  DashboardBookingRequestsIndexRoute: DashboardBookingRequestsIndexRoute,
  DashboardBookingsIndexRoute: DashboardBookingsIndexRoute,
  DashboardFacilityIndexRoute: DashboardFacilityIndexRoute,
  DashboardBookingRequestsBookingIdReviewRoute:
    DashboardBookingRequestsBookingIdReviewRoute,
  DashboardBookingsBookingIdViewRoute: DashboardBookingsBookingIdViewRoute,
}

const DashboardRouteRouteWithChildren = DashboardRouteRoute._addFileChildren(
  DashboardRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/@': typeof RouteRouteWithChildren
  '/dashboard': typeof DashboardRouteRouteWithChildren
  '/login': typeof AuthLoginRoute
  '/signup': typeof AuthSignupRoute
  '/dashboard/profile': typeof DashboardProfileRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/@/$facilityId/availability': typeof FacilityIdAvailabilityRoute
  '/@/$facilityId/book': typeof FacilityIdBookRoute
  '/@/booking-success/$bookingId': typeof BookingSuccessBookingIdRoute
  '/dashboard/facility/$roomId': typeof DashboardFacilityRoomIdRoute
  '/@/$facilityId': typeof FacilityIdIndexRoute
  '/dashboard/booking-requests': typeof DashboardBookingRequestsIndexRoute
  '/dashboard/bookings': typeof DashboardBookingsIndexRoute
  '/dashboard/facility': typeof DashboardFacilityIndexRoute
  '/dashboard/booking-requests/$bookingId/review': typeof DashboardBookingRequestsBookingIdReviewRoute
  '/dashboard/bookings/$bookingId/view': typeof DashboardBookingsBookingIdViewRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/@': typeof RouteRouteWithChildren
  '/login': typeof AuthLoginRoute
  '/signup': typeof AuthSignupRoute
  '/dashboard/profile': typeof DashboardProfileRoute
  '/dashboard': typeof DashboardIndexRoute
  '/@/$facilityId/availability': typeof FacilityIdAvailabilityRoute
  '/@/$facilityId/book': typeof FacilityIdBookRoute
  '/@/booking-success/$bookingId': typeof BookingSuccessBookingIdRoute
  '/dashboard/facility/$roomId': typeof DashboardFacilityRoomIdRoute
  '/@/$facilityId': typeof FacilityIdIndexRoute
  '/dashboard/booking-requests': typeof DashboardBookingRequestsIndexRoute
  '/dashboard/bookings': typeof DashboardBookingsIndexRoute
  '/dashboard/facility': typeof DashboardFacilityIndexRoute
  '/dashboard/booking-requests/$bookingId/review': typeof DashboardBookingRequestsBookingIdReviewRoute
  '/dashboard/bookings/$bookingId/view': typeof DashboardBookingsBookingIdViewRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/@': typeof RouteRouteWithChildren
  '/dashboard': typeof DashboardRouteRouteWithChildren
  '/_auth/login': typeof AuthLoginRoute
  '/_auth/signup': typeof AuthSignupRoute
  '/dashboard/profile': typeof DashboardProfileRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/@/$facilityId/availability': typeof FacilityIdAvailabilityRoute
  '/@/$facilityId/book': typeof FacilityIdBookRoute
  '/@/booking-success/$bookingId': typeof BookingSuccessBookingIdRoute
  '/dashboard/facility/$roomId': typeof DashboardFacilityRoomIdRoute
  '/@/$facilityId/': typeof FacilityIdIndexRoute
  '/dashboard/booking-requests/': typeof DashboardBookingRequestsIndexRoute
  '/dashboard/bookings/': typeof DashboardBookingsIndexRoute
  '/dashboard/facility/': typeof DashboardFacilityIndexRoute
  '/dashboard/booking-requests/$bookingId/review': typeof DashboardBookingRequestsBookingIdReviewRoute
  '/dashboard/bookings/$bookingId/view': typeof DashboardBookingsBookingIdViewRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/@'
    | '/dashboard'
    | '/login'
    | '/signup'
    | '/dashboard/profile'
    | '/dashboard/'
    | '/@/$facilityId/availability'
    | '/@/$facilityId/book'
    | '/@/booking-success/$bookingId'
    | '/dashboard/facility/$roomId'
    | '/@/$facilityId'
    | '/dashboard/booking-requests'
    | '/dashboard/bookings'
    | '/dashboard/facility'
    | '/dashboard/booking-requests/$bookingId/review'
    | '/dashboard/bookings/$bookingId/view'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/@'
    | '/login'
    | '/signup'
    | '/dashboard/profile'
    | '/dashboard'
    | '/@/$facilityId/availability'
    | '/@/$facilityId/book'
    | '/@/booking-success/$bookingId'
    | '/dashboard/facility/$roomId'
    | '/@/$facilityId'
    | '/dashboard/booking-requests'
    | '/dashboard/bookings'
    | '/dashboard/facility'
    | '/dashboard/booking-requests/$bookingId/review'
    | '/dashboard/bookings/$bookingId/view'
  id:
    | '__root__'
    | '/'
    | '/@'
    | '/dashboard'
    | '/_auth/login'
    | '/_auth/signup'
    | '/dashboard/profile'
    | '/dashboard/'
    | '/@/$facilityId/availability'
    | '/@/$facilityId/book'
    | '/@/booking-success/$bookingId'
    | '/dashboard/facility/$roomId'
    | '/@/$facilityId/'
    | '/dashboard/booking-requests/'
    | '/dashboard/bookings/'
    | '/dashboard/facility/'
    | '/dashboard/booking-requests/$bookingId/review'
    | '/dashboard/bookings/$bookingId/view'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  RouteRoute: typeof RouteRouteWithChildren
  DashboardRouteRoute: typeof DashboardRouteRouteWithChildren
  AuthLoginRoute: typeof AuthLoginRoute
  AuthSignupRoute: typeof AuthSignupRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  RouteRoute: RouteRouteWithChildren,
  DashboardRouteRoute: DashboardRouteRouteWithChildren,
  AuthLoginRoute: AuthLoginRoute,
  AuthSignupRoute: AuthSignupRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/@",
        "/dashboard",
        "/_auth/login",
        "/_auth/signup"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/@": {
      "filePath": "@/route.tsx",
      "children": [
        "/@/$facilityId/availability",
        "/@/$facilityId/book",
        "/@/booking-success/$bookingId",
        "/@/$facilityId/"
      ]
    },
    "/dashboard": {
      "filePath": "dashboard/route.tsx",
      "children": [
        "/dashboard/profile",
        "/dashboard/",
        "/dashboard/facility/$roomId",
        "/dashboard/booking-requests/",
        "/dashboard/bookings/",
        "/dashboard/facility/",
        "/dashboard/booking-requests/$bookingId/review",
        "/dashboard/bookings/$bookingId/view"
      ]
    },
    "/_auth/login": {
      "filePath": "_auth/login.tsx"
    },
    "/_auth/signup": {
      "filePath": "_auth/signup.tsx"
    },
    "/dashboard/profile": {
      "filePath": "dashboard/profile.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx",
      "parent": "/dashboard"
    },
    "/@/$facilityId/availability": {
      "filePath": "@/$facilityId/availability.tsx",
      "parent": "/@"
    },
    "/@/$facilityId/book": {
      "filePath": "@/$facilityId/book.tsx",
      "parent": "/@"
    },
    "/@/booking-success/$bookingId": {
      "filePath": "@/booking-success.$bookingId.tsx",
      "parent": "/@"
    },
    "/dashboard/facility/$roomId": {
      "filePath": "dashboard/facility/$roomId.tsx",
      "parent": "/dashboard"
    },
    "/@/$facilityId/": {
      "filePath": "@/$facilityId/index.tsx",
      "parent": "/@"
    },
    "/dashboard/booking-requests/": {
      "filePath": "dashboard/booking-requests/index.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/bookings/": {
      "filePath": "dashboard/bookings/index.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/facility/": {
      "filePath": "dashboard/facility/index.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/booking-requests/$bookingId/review": {
      "filePath": "dashboard/booking-requests/$bookingId.review.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/bookings/$bookingId/view": {
      "filePath": "dashboard/bookings/$bookingId.view.tsx",
      "parent": "/dashboard"
    }
  }
}
ROUTE_MANIFEST_END */
