import { createFileRoute } from '@tanstack/react-router'
import RestaurantAdminTab from "@/features/restaurants/admin/restaurant-admin-tab.tsx";

export const Route = createFileRoute(
  '/_authenticated/restaurants/restaurant-management',
)({
  component: RestaurantAdminTab,
})

