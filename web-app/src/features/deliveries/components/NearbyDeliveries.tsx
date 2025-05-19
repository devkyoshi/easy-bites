import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Package, ArrowRight } from "lucide-react";
import { useDelivery } from "../context/delivery-context";
import { EmptyDriverState } from "./EmptyDriverState";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useAuth } from "@/stores/auth-context.tsx";
import { toast } from "sonner";
import {AxiosError} from "axios";

export function NearbyDeliveries() {
    const { nearbyOrders, loading, acceptOrder, currentLocation, fetchNearbyOrders, driver } = useDelivery();
    const { currentUser } = useAuth();
    const [isAccepting, setIsAccepting] = useState(false);
    const [localLoading, setLocalLoading] = useState(true);

    useEffect(() => {
        if (!currentUser || !driver || !currentLocation) return;

        setLocalLoading(true);

        const fetchData = async () => {
            try {
                await fetchNearbyOrders(currentUser.userId, currentLocation.lat, currentLocation.lng);
            } catch (_) {
                // Optional: toast for fetch failure
            } finally {
                setLocalLoading(false);
            }
        };

        fetchData();
    }, [currentUser?.userId, currentLocation?.lat, currentLocation?.lng]);

    const handleAcceptOrder = async (orderId: number) => {
        if (!currentLocation) {
            toast.error("Location unavailable. Please enable location services and try again.");
            return;
        }

        setIsAccepting(true);

        try {
            await acceptOrder({
                orderId,
                currentLat: currentLocation.lat,
                currentLng: currentLocation.lng
            });

            toast.success("Order accepted successfully!");
        } catch (error) {
            let message = "Something went wrong. Please try again.";

            const axiosError = error as AxiosError;

            if (axiosError?.response?.data && typeof axiosError.response.data === "object") {
                const responseData = axiosError.response.data as { message?: string };
                if (responseData.message) {
                    message = responseData.message;

                    switch (message) {
                        case "DRIVER_NOT_FOUND":
                            toast.error("Driver not found. Please re-login.");
                            break;
                        case "DRIVER_NOT_AVAILABLE":
                            toast.error("You are currently unavailable to accept deliveries.");
                            break;
                        case "ORDER_NOT_FOUND":
                            toast.error("This order no longer exists.");
                            break;
                        case "ORDER_ITEM_NOT_FOUND":
                            toast.error("Order items not found. Cannot proceed.");
                            break;
                        case "RESTAURANT_NOT_FOUND":
                            toast.error("Restaurant not found for this order.");
                            break;
                        case "DRIVER_ACCEPTED_ORDER":
                            toast.error("This order has already been accepted by another driver.");
                            break;
                        case "GEOCODING_UNAVAILABLE":
                            toast.error("Unable to locate the address. Please try again later.");
                            break;
                        default:
                            toast.error(message);
                    }
                } else {
                    toast.error(message);
                }
            } else {
                toast.error(message);
            }
        } finally {
            setIsAccepting(false);
        }
    };

    const isLoading = loading || localLoading || !currentLocation;

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>
                        {!currentLocation ? "Getting your location..." : "Nearby Deliveries"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                </div>
                            </div>
                        ))}
                    </div>
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
                                disabled={isAccepting}
                            >
                                {isAccepting ? "Accepting..." : "Accept Delivery"}
                                {!isAccepting && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
