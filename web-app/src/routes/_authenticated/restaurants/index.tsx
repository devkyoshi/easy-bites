import { createFileRoute } from '@tanstack/react-router'
import RestaurantTab from "@/features/restaurants";

export const Route = createFileRoute('/_authenticated/restaurants/')({
  component: RestaurantTab,
})


