import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Package, ArrowRight } from "lucide-react";
import { useDelivery } from "../context/delivery-context";
import { EmptyDriverState } from "./EmptyDriverState";
import { Skeleton } from "@/components/ui/skeleton";
import {useEffect} from "react";
import {useAuth} from "@/stores/auth-context.tsx";

export function NearbyDeliveries() {
    const { nearbyOrders, loading, acceptOrder, currentLocation, fetchNearbyOrders } = useDelivery();

    const {currentUser} = useAuth();
    useEffect(() => {
        if (!currentUser) {
            console.warn("Cannot fetch nearby orders: driver is not available");
            return;
        }

        if (!currentLocation) {
            console.warn("Cannot fetch nearby orders: current location is not set");
            return;
        }

        const fetchData = async () => {
            try {
                await fetchNearbyOrders(currentUser.userId, currentLocation.lat, currentLocation.lng);
            } catch (err) {
                console.error("Error fetching nearby orders", err);
            }
        };

        fetchData();
    }, [currentUser?.userId, currentLocation?.lat, currentLocation?.lng]);

    const handleAcceptOrder = async (orderId: number) => {
        console.log(orderId);
        if (!currentLocation) {
            console.warn("Cannot accept order: current location is not set");
            return;
        }

        try {
            await acceptOrder({
                orderId,
                currentLat: currentLocation.lat,
                currentLng: currentLocation.lng
            });
        } catch (error) {
            console.error("Failed to accept order:", error);
        }
    };

    if (loading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Nearby Deliveries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[150px]" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (!nearbyOrders || nearbyOrders.length === 0) {
        return (
            <EmptyDriverState
                title="No Nearby Deliveries"
                description="There are currently no deliveries available in your area"
                icon="package-search"
            />
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Nearby Deliveries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {nearbyOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Package className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium">Order #{order.id}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {(order.items?.length || 0)} item{order.items?.length === 1 ? '' : 's'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-primary">
                                ${order.totalAmount.toFixed(2)}
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center text-sm">
                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{order.deliveryAddress}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>
                                    Placed at {new Date(order.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button
                                size="sm"
                                onClick={() => handleAcceptOrder(order.id)}
                                className="flex items-center"
                            >
                                Accept Delivery <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}