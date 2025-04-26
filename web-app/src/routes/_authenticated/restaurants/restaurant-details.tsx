import { createFileRoute } from '@tanstack/react-router'
import {RestaurantDetails} from "@/features/restaurants/restaurant-tabs/restaurant-details.tsx";

export const Route = createFileRoute(
  '/_authenticated/restaurants/restaurant-details',
)({
  component: RestaurantDetails,
})

