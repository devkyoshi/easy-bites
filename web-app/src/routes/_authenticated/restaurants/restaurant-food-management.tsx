import { createFileRoute } from '@tanstack/react-router'
import {FoodItemsTab} from "@/features/restaurants/admin/restaurant-food-items-tab.tsx";

export const Route = createFileRoute(
  '/_authenticated/restaurants/restaurant-food-management',
)({
  component: FoodItemsTab,
})


