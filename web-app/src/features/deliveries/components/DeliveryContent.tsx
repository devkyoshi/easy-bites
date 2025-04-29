import {useMatchRoute, useNavigate} from "@tanstack/react-router";
import {DriverDashboard} from "../delivery-tabs/DriverDashboard";
import {AnalyticsDashboard} from "../delivery-tabs/AnalyticsDashboard";
import {DeliveryDetails} from "../delivery-tabs/delivery-details";
import {CustomerTrackingPage} from "@/features/deliveries/delivery-tabs/CustomerTrackingPage.tsx";
import {toast} from "sonner";
import {useEffect} from "react";

interface DeliveryContentProps {
    driverId: number;
    role: string;
}

export function DeliveryContent({driverId, role}: DeliveryContentProps) {
    const matchRoute = useMatchRoute();
    const navigate = useNavigate();

    const isAnalytics = matchRoute({ to: '/deliveries/driver-analytics' });
    const isDeliveryDetail = matchRoute({ to: '/deliveries/delivery-details' });
    const isCustomerTracking = matchRoute({ to: '/deliveries/customer-delivery-tracking' });

    useEffect(() => {
        if ((isAnalytics || isDeliveryDetail) && role !== 'ROLE_DELIVERY_PERSON') {
            toast.error("Access restricted to delivery personnel");
            navigate({ to: '/' });
        }
    }, [isAnalytics, isDeliveryDetail, role, navigate]);

    if (isCustomerTracking) {
        return <CustomerTrackingPage />;
    }

    if (role !== 'ROLE_DELIVERY_PERSON') {
        toast.error("Access restricted to delivery personnel");
        navigate({ to: '/' });
        return null;
    }

    if (isAnalytics) {
        return <AnalyticsDashboard driverId={driverId} />;
    }

    if (isDeliveryDetail) {
        return <DeliveryDetails />;
    }

    return <DriverDashboard driverId={driverId} />;
}