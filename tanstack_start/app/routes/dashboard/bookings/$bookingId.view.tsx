import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/bookings/$bookingId/view')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/bookings/$booking_id/view"!</div>
}
