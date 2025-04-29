import { createFileRoute } from '@tanstack/react-router'
import {CustomerTrackingPage} from "@/features/deliveries/delivery-tabs/CustomerTrackingPage.tsx";

export const Route = createFileRoute(
  '/_authenticated/deliveries/customer-delivery-tracking',
)({
  component: CustomerTrackingPage,
})
