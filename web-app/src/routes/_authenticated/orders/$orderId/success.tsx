import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/orders/$orderId/success')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Success</div>
}
