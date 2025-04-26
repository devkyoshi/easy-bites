import { createFileRoute } from '@tanstack/react-router'
import {RestaurantProvider} from "@/features/restaurants/context/restaurant-context.tsx";
import {RestaurantManagementTab} from "@/features/restaurants/admin/pages/restaurant-management.tsx";

export const Route = createFileRoute(
  '/_authenticated/restaurants/restaurant-management',
)({
  component: () => (<RestaurantProvider>
    <RestaurantManagementTab/>
  </RestaurantProvider>),
})

