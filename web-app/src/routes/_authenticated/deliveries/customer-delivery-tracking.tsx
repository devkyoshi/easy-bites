import { createFileRoute } from '@tanstack/react-router'
import {CustomerTrackingPage} from "@/features/deliveries/delivery-tabs/CustomerTrackingPage.tsx";
import {DeliveryProvider} from "@/features/deliveries/context/delivery-context.tsx";
import {DeliveryDetails} from "@/features/deliveries/delivery-tabs/delivery-details.tsx";

export const Route = createFileRoute(
  '/_authenticated/deliveries/customer-delivery-tracking',
)({
  component: CustomerTrackingPageInfo,
})

function CustomerTrackingPageInfo() {
  return (
      <DeliveryProvider>
        <CustomerTrackingPage />
      </DeliveryProvider>
  );
}
