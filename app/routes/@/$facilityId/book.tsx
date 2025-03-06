import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/@/$facilityId/book')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/@/$facilityId/book"!</div>
}
