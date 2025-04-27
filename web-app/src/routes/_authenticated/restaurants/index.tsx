import { createFileRoute } from '@tanstack/react-router'
import CustomerRestaurantsTab from '@/features/restaurants/customer/pages/customer-restaurants.tsx'

export const Route = createFileRoute('/_authenticated/restaurants/')({
  component: CustomerRestaurantsTab,
})
