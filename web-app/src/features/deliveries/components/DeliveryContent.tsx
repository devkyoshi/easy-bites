import {useMatchRoute} from "@tanstack/react-router";
import {DriverDashboard} from "../delivery-tabs/DriverDashboard";
import {AnalyticsDashboard} from "../delivery-tabs/AnalyticsDashboard";
import {DeliveryDetails} from "../delivery-tabs/delivery-details";

interface DeliveryContentProps {
    driverId: number
}

export function DeliveryContent({driverId}: DeliveryContentProps) {
    const matchRoute = useMatchRoute();
    const isAnalytics = matchRoute({ to: '/deliveries/driver-analytics' });
    const isDeliveryDetail = matchRoute({ to: '/deliveries/delivery-details' });

    if (isAnalytics) {
        return <AnalyticsDashboard driverId={driverId} />;
    }

    if (isDeliveryDetail) {
        return <DeliveryDetails />;
    }

    return <DriverDashboard driverId={driverId} />;
}