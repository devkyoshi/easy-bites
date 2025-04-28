import { createFileRoute } from '@tanstack/react-router';
import { DeliveryDetails } from "@/features/deliveries/delivery-tabs/delivery-details.tsx";

export const Route = createFileRoute('/_authenticated/deliveries/delivery-details')({
    component: DeliveryDetails,
});