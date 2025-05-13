import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Package, ArrowRight } from "lucide-react";
import { useDelivery } from "../context/delivery-context";
import { EmptyDriverState } from "./EmptyDriverState";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useAuth } from "@/stores/auth-context.tsx";
import {toast} from "sonner";

export function NearbyDeliveries() {
    const { nearbyOrders, loading, acceptOrder, currentLocation, fetchNearbyOrders, driver } = useDelivery();
    const { currentUser } = useAuth();
    const [isAccepting, setIsAccepting] = useState(false);
    const [localLoading, setLocalLoading] = useState(true);

    useEffect(() => {
        // Debug logging
        console.log("NearbyDeliveries component - Rendering with:", {
            hasCurrentUser: !!currentUser,
            hasDriver: !!driver,
            hasCurrentLocation: !!currentLocation,
            currentLocationData: currentLocation,
            loadingState: loading,
            nearbyOrdersCount: nearbyOrders?.length
        });
    }, [currentUser, driver, currentLocation, loading, nearbyOrders]);

    useEffect(() => {
        if (!currentUser || !driver) {
            console.warn("Cannot fetch nearby orders: driver or user is not available");
            return;
        }

        if (!currentLocation) {
            console.warn("Cannot fetch nearby orders: current location is not set");
            return;
        }

        setLocalLoading(true);

        const fetchData = async () => {
            try {
                await fetchNearbyOrders(currentUser.userId, currentLocation.lat, currentLocation.lng);
                console.log("Successfully fetched nearby orders");
            } catch (err) {
                console.error("Error fetching nearby orders", err);
            } finally {
                setLocalLoading(false);
            }
        };

        fetchData();
    }, [currentUser?.userId, currentLocation?.lat, currentLocation?.lng, driver, fetchNearbyOrders]);

    const handleAcceptOrder = async (orderId) => {
        if (!currentLocation) {
            console.warn("Cannot accept order: current location is not set");
            toast({
                title: "Location unavailable",
                description: "Please enable location services and try again",
                variant: "destructive"
            });
            return;
        }

        setIsAccepting(true);
        try {
            await acceptOrder({
                orderId,
                currentLat: currentLocation.lat,
                currentLng: currentLocation.lng
            });
            toast({
                title: "Success",
                description: "Order accepted successfully",
            });
        } catch (error) {
            console.error("Failed to accept order:", error);
            toast({
                title: "Failed to accept order",
                description: "Please try again later",
                variant: "destructive"
            });
        } finally {
            setIsAccepting(false);
        }
    };

    // Debug display for location data
    const renderLocationDebug = () => (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-gray-700">
                <strong>Location Debug:</strong> {currentLocation ? 'Available' : 'Not Available'}
                {currentLocation && (
                    <span> - Lat: {currentLocation.lat.toFixed(5)}, Lng: {currentLocation.lng.toFixed(5)}</span>
                )}
            </p>
        </div>
    );

    // Combined loading state
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
                    {renderLocationDebug()}
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
                {renderLocationDebug()}

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