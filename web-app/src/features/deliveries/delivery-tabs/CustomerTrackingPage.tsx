import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RealTimeMap } from "../components/RealTimeMap";
import { useDelivery } from "../context/delivery-context";
import { Card } from "@/components/ui/card";
import { DeliveryRating } from "../components/DeliveryRating";
import { IconUser, IconCar, IconMapPin } from "@tabler/icons-react";
import {IDeliveryResponse, IDriverResponse, ILocation} from "@/services/types/delivery.type.ts";
import {api} from "@/config/axios.ts";
type LocationState = { deliveryId: number }

export function CustomerTrackingPage() {
    const location = useLocation();
    const { deliveryId } = location.state as unknown as LocationState;
    const { getDelivery, refreshDriverLocation } = useDelivery();
    const [delivery, setDelivery] = useState<IDeliveryResponse | null>(null);
    const [driver, setDriver] = useState<IDriverResponse | null>(null);
    const [driverLocation, setDriverLocation] = useState<ILocation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const deliveryData = getDelivery(deliveryId);
                if (!deliveryData) throw new Error("Delivery not found");

                setDelivery(deliveryData);

                // Fetch driver information
                try {
                    const driverResponse = await api.get<IDriverResponse>(`/drivers/${deliveryData.driverId}`);
                    setDriver(driverResponse.data);
                } catch (driverError) {
                    console.error("Failed to fetch driver details:", driverError);
                }

                // Initial location fetch
                const initialLocation = await refreshDriverLocation(deliveryData.driverId);
                setDriverLocation(initialLocation);

                // Refresh driver location every 10 seconds
                const interval = setInterval(async () => {
                    const location = await refreshDriverLocation(deliveryData.driverId);
                    if (location) setDriverLocation(location);
                }, 10000);

                return () => clearInterval(interval);
            } catch (error) {
                console.error("Failed to load delivery data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [deliveryId]);

    if (loading) return <div>Loading delivery information...</div>;
    if (!delivery) return <div>Delivery not found</div>;

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">Track Your Delivery #{delivery.deliveryId}</h1>

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
                                <div className="flex items-center justify-center h-full">
                                    <p>Loading driver location...</p>
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
                                            : "Updating..."}
                                    </p>
                                </div>
                            </div>

                            {driver && (
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
                            )}
                        </div>
                    </Card>

                    {delivery.status === 'DELIVERED' && !delivery.rating && (
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Rate Your Delivery</h2>
                            <DeliveryRating deliveryId={delivery.deliveryId} />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}