import { createFileRoute } from '@tanstack/react-router';
import { DeliveryDetails } from "@/features/deliveries/delivery-tabs/delivery-details.tsx";
import {DeliveryProvider} from "@/features/deliveries/context/delivery-context.tsx";

export const Route = createFileRoute('/_authenticated/deliveries/delivery-details')({
    component: DeliveryDetailsPage,
});

function DeliveryDetailsPage() {
    return (
        <DeliveryProvider>
            <DeliveryDetails />
        </DeliveryProvider>
    );
}