import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/booking-requests/$bookingId/review',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/booking-requests/$bookingId/review"!</div>
}
