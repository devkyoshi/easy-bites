import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/orders/$orderId/cancel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Failed</div>
}
