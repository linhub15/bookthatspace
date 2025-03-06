import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/@/$facilityId/availability')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/@/$facilityId/availability"!</div>
}
