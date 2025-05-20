import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RealTimeMap } from "../components/RealTimeMap";
import { useDelivery } from "../context/delivery-context";
import { Card } from "@/components/ui/card";
import { DeliveryRating } from "../components/DeliveryRating";
import { IconUser, IconCar, IconMapPin, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { IDeliveryResponse, IDriverResponse, ILocation } from "@/services/types/delivery.type";
import { api } from "@/config/axios.ts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type LocationState = { orderId: number }

export function CustomerTrackingPage() {
    const location = useLocation();
    const { orderId } = location.state as unknown as LocationState;
    const { refreshDriverLocation } = useDelivery();
    const [delivery, setDelivery] = useState<IDeliveryResponse | null>(null);
    const [driver, setDriver] = useState<IDriverResponse | null>(null);
    const [driverLocation, setDriverLocation] = useState<ILocation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ratingSuccess, setRatingSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const orderResponse = await api.get(
                    `/api/delivery/delivery/by-order/${orderId}`
                );
                const deliveryResult = orderResponse.data.result;

                if (!deliveryResult) {
                    throw new Error("Delivery not found");
                }

                setDelivery(deliveryResult);

                // Fetch driver information
                try {
                    const driverResponse = await api.get(`/api/delivery/drivers/${deliveryResult.driverId}`);
                    setDriver(driverResponse.data.result);
                } catch (driverError) {
                    console.error("Failed to fetch driver details:", driverError);
                    setError("Could not load driver information");
                }

                // Initial location fetch
                try {
                    const initialLocation = await refreshDriverLocation(deliveryResult.driverId);
                    setDriverLocation(initialLocation);
                } catch (locationError) {
                    console.error("Failed to fetch initial location:", locationError);
                    setError("Could not load driver location");
                }

                // Refresh driver location every 10 seconds
                const interval = setInterval(async () => {
                    try {
                        const location = await refreshDriverLocation(deliveryResult.driverId);
                        if (location) setDriverLocation(location);
                    } catch (refreshError) {
                        console.error("Failed to refresh location:", refreshError);
                    }
                }, 10000);

                return () => clearInterval(interval);
            } catch (error) {
                console.error("Failed to load delivery data:", error);
                setError(error instanceof Error ? error.message : "Failed to load delivery information");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId]);

    if (loading) {
        return (
            <div className="container mx-auto p-4 max-w-6xl space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="h-[500px]" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-64" />
                        <Skeleton className="h-64" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 max-w-6xl">
                <Alert variant="destructive">
                    <IconAlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                        <div className="mt-4">
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!delivery) {
        return (
            <div className="container mx-auto p-4 max-w-6xl">
                <Alert variant="destructive">
                    <IconAlertCircle className="h-4 w-4" />
                    <AlertTitle>Delivery Not Found</AlertTitle>
                    <AlertDescription>
                        We couldn't find a delivery with order ID #{orderId}. Please check your order details.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">Track Your Delivery #{delivery.deliveryId}</h1>

            {ratingSuccess && (
                <Alert className="mb-6">
                    <IconCheck className="h-4 w-4" />
                    <AlertTitle>Thank you!</AlertTitle>
                    <AlertDescription>
                        Your rating has been submitted successfully.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <div className="p-4 h-[500px]">
                            {driverLocation ? (
                                <RealTimeMap
                                    driverLocation={driverLocation}
                                    orders={[]}
                                    activeDelivery={delivery}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-2">
                                    <IconAlertCircle className="h-8 w-8 text-yellow-500" />
                                    <p>Driver location not available</p>
                                    <p className="text-sm text-muted-foreground">
                                        We'll keep trying to fetch the location...
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Delivery Status</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <IconMapPin className="h-5 w-5 mr-3 mt-1 text-blue-500" />
                                <div>
                                    <p className="font-medium">Current Location</p>
                                    <p className="text-muted-foreground">
                                        {driverLocation
                                            ? `${driverLocation.lat.toFixed(4)}, ${driverLocation.lng.toFixed(4)}`
                                            : "Location unavailable"}
                                    </p>
                                </div>
                            </div>

                            {driver ? (
                                <>
                                    <div className="flex items-start">
                                        <IconUser className="h-5 w-5 mr-3 mt-1 text-green-500" />
                                        <div>
                                            <p className="font-medium">Driver</p>
                                            <p className="text-muted-foreground">
                                                {driver.firstName} {driver.lastName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <IconCar className="h-5 w-5 mr-3 mt-1 text-yellow-500" />
                                        <div>
                                            <p className="font-medium">Vehicle</p>
                                            <p className="text-muted-foreground">
                                                {driver.vehicleType} ({driver.vehicleNumber})
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Alert variant="destructive">
                                    <IconAlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Driver information not available
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </Card>

                    {delivery.status === 'DELIVERED' && (
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Rate Your Delivery</h2>
                            <DeliveryRating
                                deliveryId={delivery.deliveryId}
                            />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}