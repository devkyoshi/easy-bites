import { createFileRoute } from '@tanstack/react-router'
import RestaurantAdminTab from "@/features/restaurants/admin/restaurant-admin-tab.tsx";
import {RestaurantProvider} from "@/features/restaurants/context/restaurant-context.tsx";

export const Route = createFileRoute(
  '/_authenticated/restaurants/restaurant-management',
)({
  component: () => (<RestaurantProvider>
    <RestaurantAdminTab/>
  </RestaurantProvider>),
})

