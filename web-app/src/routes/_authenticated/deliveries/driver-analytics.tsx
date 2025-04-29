import { createFileRoute } from '@tanstack/react-router';
import { AnalyticsDashboard } from '@/features/deliveries/delivery-tabs/AnalyticsDashboard.tsx';
import { DeliveryProvider } from '@/features/deliveries/context/delivery-context';

export const Route = createFileRoute('/_authenticated/deliveries/driver-analytics')({
    component: AnalyticsPage,
});

function AnalyticsPage() {
    return (
        <DeliveryProvider>
            <AnalyticsDashboard />
        </DeliveryProvider>
    );
}