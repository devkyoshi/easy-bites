import { createFileRoute } from '@tanstack/react-router'
import {CategoryTab} from "@/features/restaurants/admin/restaurant-category-tab.tsx";

export const Route = createFileRoute(
  '/_authenticated/restaurants/restaurant-category-management',
)({
  component: CategoryTab,
})


