import { useLocation } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { DeliveryLayout } from "../layouts/DeliveryLayout";
import { DeliveryCompletion } from "../components/DeliveryCompletion";
import { DeliveryRating } from "../components/DeliveryRating";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "../components/StatusBadge";
import { format } from "date-fns";
import { IconMapPin, IconCoin } from "@tabler/icons-react";
import { RealTimeMap } from "../components/RealTimeMap";
import { useEffect, useState } from "react";
import { fetchOrderDetails } from "@/services/delivery-service";
import { IOrder, IDeliveryResponse } from "@/services/types/delivery.type";
import { DeliverySkeleton } from "../components/DeliverySkeleton";
import { EmptyDeliveryState } from "../components/EmptyDeliveryState";
import { api } from "@/config/axios";
import {useAuth} from "@/stores/auth-context.tsx";

type LocationState = { deliveryId: number }
type Status =
    'PENDING' |
    'RESTAURANT_ACCEPTED' |
    'DRIVER_ASSIGNED' |
    'DELIVERED' |
    'DELIVERY_FAILED';

export function DeliveryDetails() {
    const navigate = useNavigate();
    const location = useLocation()
    const state = location.state as unknown as LocationState;
    const deliveryId = state?.deliveryId;
    const [delivery, setDelivery] = useState<IDeliveryResponse | null>(null);
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    const isValidStatus = (status: string): status is Status => {
        return ['PENDING', 'RESTAURANT_ACCEPTED', 'DRIVER_ASSIGNED', 'DELIVERED', 'DELIVERY_FAILED'].includes(status);
    };

    const showCompletion = order &&
        ['DRIVER_ASSIGNED', 'RESTAURANT_ACCEPTED'].includes(order.status)
        && currentUser?.role === 'ROLE_DELIVERY_PERSON';

    const handleBackClick = () => {
        navigate({ to: '/deliveries' });
    };

    const getUniqueRestaurants = (items: IOrder['items']) => {
        const restaurantMap = new Map<number, { id: number, name: string }>();
        items?.forEach(item => {
            if (!restaurantMap.has(item.restaurantId)) {
                restaurantMap.set(item.restaurantId, {
                    id: item.restaurantId,
                    name: item.restaurantName
                });
            }
        });
        return Array.from(restaurantMap.values());
    };

    useEffect(() => {
        // Get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLocationError("Could not determine your current location");
                }
            );
        } else {
            setLocationError("Geolocation is not supported by your browser");
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch delivery details
                const deliveryResponse = await api.get(`/api/delivery/delivery/${deliveryId}`);
                const deliveryData = deliveryResponse.data.result;
                setDelivery(deliveryData);

                // Fetch order details if delivery exists
                if (deliveryData) {
                    const orderData = await fetchOrderDetails(deliveryData.orderId);
                    setOrder(orderData);
                }
            } catch (err) {
                console.error("Failed to fetch delivery details", err);
                setError("Failed to load delivery details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [deliveryId]);

    if (loading) {
        return (
            <DeliveryLayout
                title="Delivery Details"
                description={`Details for delivery #${deliveryId}`}
                showBackButton
                onBackClick={handleBackClick}
            >
                <DeliverySkeleton context="details" />
            </DeliveryLayout>
        );
    }

    if (error) {
        return (
            <DeliveryLayout
                title="Delivery Details"
                description={`Details for delivery #${deliveryId}`}
                showBackButton
                onBackClick={handleBackClick}
            >
                <div className="text-red-500">{error}</div>
            </DeliveryLayout>
        );
    }

    if (!delivery) {
        return (
            <DeliveryLayout
                title="Delivery Details"
                description={`Details for delivery #${deliveryId}`}
                showBackButton
                onBackClick={handleBackClick}
            >
                <EmptyDeliveryState context="details" />
            </DeliveryLayout>
        );
    }

    return (
        <DeliveryLayout
            title="Delivery Details"
            description={`Details for delivery #${deliveryId}`}
            showBackButton
            onBackClick={handleBackClick}
        >
            {locationError && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                {locationError} - Map may not show accurate location
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Card className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Delivery #{delivery.deliveryId}</h1>
                        <p className="text-muted-foreground">
                            {format(new Date(delivery.createdAt), 'MMMM do, yyyy hh:mm a')}
                        </p>
                    </div>
                    {isValidStatus(order?.status || '') ? (
                        <StatusBadge status={order!.status} />
                    ) : (
                        <div className="text-red-500">Unknown Status</div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {order && (
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <IconMapPin className="h-5 w-5 mr-3 text-blue-500" />
                                <div>
                                    <p className="font-medium">Restaurants</p>
                                    <div className="text-muted-foreground">
                                        {getUniqueRestaurants(order.items).map(restaurant => (
                                            <p key={restaurant.id}>{restaurant.name}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <IconMapPin className="h-5 w-5 mr-3 text-green-500" />
                                <div>
                                    <p className="font-medium">Delivery Address</p>
                                    <p className="text-muted-foreground">
                                        {order.deliveryAddress}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <IconCoin className="h-5 w-5 mr-3 text-yellow-500" />
                                <div>
                                    <p className="font-medium">Total Amount</p>
                                    <p className="text-muted-foreground">
                                        LKR {order.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        {currentLocation && (
                            <RealTimeMap
                                driverLocation={currentLocation}
                                orders={[]}
                                activeDelivery={delivery}
                                className="h-96"
                            />
                        )}
                    </div>
                </div>
            </Card>

            {showCompletion && (
                <DeliveryCompletion deliveryId={delivery.deliveryId} />
            )}

            {order?.status === 'DELIVERED' && !delivery.rating &&
                currentUser?.role === 'ROLE_CUSTOMER' && (
                <DeliveryRating deliveryId={delivery.deliveryId} />
            )}
        </DeliveryLayout>
    );
}