import { Card } from "@/components/ui/card";
import { useDelivery } from "@/features/deliveries/context/delivery-context";
import { RealTimeMap } from "./RealTimeMap";
import { Button } from "@/components/ui/button";
import { IconMapPin, IconLoader2 } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {IDeliveryResponse, ILocation} from "@/services/types/delivery.type";

interface ActiveDeliveriesProps {
    driverId: number;
}

export const ActiveDeliveries = (_: ActiveDeliveriesProps) => {
    const { activeDelivery, nearbyOrders, loading, updateLocation } = useDelivery();
    const navigate = useNavigate();

    const [driverLocation, setDriverLocation] = useState<ILocation>({
        lat: 6.9271,
        lng: 79.8612,
    });

    useEffect(() => {
        let lastUpdate = 0;
        const updateInterval = 10000; // 10 seconds

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const now = Date.now();
                if (now - lastUpdate > updateInterval) {
                    lastUpdate = now;
                    const newLocation: ILocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: position.timestamp,
                        accuracy: position.coords.accuracy,
                    };
                    setDriverLocation(newLocation);
                    updateLocation(newLocation); // Call context method to update
                }
            },
            (error) => {
                console.error("Error getting driver location", error);
            },
            { enableHighAccuracy: true }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [updateLocation])

    const handleNavigateToDeliveryDetail = (delivery: IDeliveryResponse) => {
        if (!activeDelivery) return;

        navigate({
            to: '/deliveries/delivery-details',
            state: { deliveryId: activeDelivery.deliveryId },
        }).then();
    };

    if (loading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center h-64">
                    <IconLoader2 className="h-8 w-8 animate-spin" />
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                    {activeDelivery ? "Current Delivery" : "Available Deliveries"}
                </h2>
                {activeDelivery && (
                    <Button
                        variant="outline"
                        onClick={() => handleNavigateToDeliveryDetail(activeDelivery)}
                    >
                        <IconMapPin className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
                )}
            </div>

            <div className="rounded-lg overflow-hidden">
                <RealTimeMap
                    driverLocation={driverLocation}
                    orders={activeDelivery ? [] : nearbyOrders}
                    activeDelivery={activeDelivery}
                    className="h-96"
                />
            </div>

            {!activeDelivery && nearbyOrders.length === 0 && (
                <div className="mt-4 text-center text-gray-500">
                    No available deliveries in your area
                </div>
            )}
        </Card>
    );
};
