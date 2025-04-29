import { createFileRoute } from '@tanstack/react-router'
import { RestaurantRegistration } from '@/features/restaurants/admin/pages/restaurant-registration.tsx'

export const Route = createFileRoute(
  '/_authenticated/restaurants/restaurant-registration'
)({
  component: RestaurantRegistration,
})
