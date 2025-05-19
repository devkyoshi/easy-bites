import { createFileRoute } from '@tanstack/react-router'
import { RestaurantOrderRequests } from '@/features/restaurants/admin/pages/restaurant-order-requests.tsx'

export const Route = createFileRoute(
  '/_authenticated/restaurants/restaurant-orders'
)({
  component: RestaurantOrderRequests,
})
