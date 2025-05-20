import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useDelivery } from "@/features/deliveries/context/delivery-context";
import { DeliveryCard } from "../components/DeliveryCard";
import { useNavigate } from "@tanstack/react-router";
import { IOrder } from "@/services/types/delivery.type";
import { DeliverySkeleton } from "@/features/deliveries/components/DeliverySkeleton";
import { EmptyDeliveryState } from "@/features/deliveries/components/EmptyDeliveryState";
import { fetchOrderDetails } from "@/services/delivery-service";

type EnrichedDelivery = {
    deliveryId: number;
    orderId: number;
    status: string;
    createdAt: string;
    order: {
        restaurantNames: string[];
        totalAmount: number;
        deliveryAddress: string;
    };
};

export const DeliveryHistory = ({ driverId }: { driverId: number }) => {
    const { deliveryHistory, loading, error } = useDelivery();
    const navigate = useNavigate();
    const [enrichedDeliveries, setEnrichedDeliveries] = useState<EnrichedDelivery[]>([]);
    const [enriching, setEnriching] = useState(true);

    const handleNavigateToDeliveryDetail = (delivery: EnrichedDelivery) => {
        console.log("enriched:",delivery);
        navigate({
            to: '/deliveries/delivery-details',
            state: { deliveryId: delivery.deliveryId }
        }).then();
    };

    useEffect(() => {
        const enrichDeliveries = async () => {
            if (!deliveryHistory || deliveryHistory.length === 0) {
                setEnrichedDeliveries([]);
                setEnriching(false);
                return;
            }

            try {
                const enriched = await Promise.all(deliveryHistory.map(async (delivery) => {
                    try {
                        const order: IOrder = await fetchOrderDetails(delivery.orderId);

                        const restaurantNames = Array.from(
                            new Set(order.items.map(item => item.restaurantName))
                        );

                        return {
                            deliveryId: delivery.deliveryId, // Ensure `id` is correctly mapped
                            orderId: delivery.orderId,
                            status: delivery.status,
                            createdAt: delivery.createdAt,
                            order: {
                                restaurantNames,
                                totalAmount: order.totalAmount,
                                deliveryAddress: order.deliveryAddress,
                            }
                        };
                    } catch (err) {
                        console.error("Failed to enrich delivery:", err);
                        return null;
                    }
                }));

                setEnrichedDeliveries(enriched.filter(Boolean) as EnrichedDelivery[]);
            } finally {
                setEnriching(false);
            }
        };

        enrichDeliveries();
    }, [deliveryHistory]);

    if (loading || enriching) {
        return <DeliverySkeleton context="history" />;
    }

    if (error) {
        return <div className="text-red-500">Error loading history</div>;
    }

    if (enrichedDeliveries.length === 0) {
        return <EmptyDeliveryState context="history" />;
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Delivery History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrichedDeliveries.map((delivery) => (
                    <DeliveryCard
                        key={`${delivery.deliveryId}-${delivery.createdAt}`}
                        delivery={delivery}
                        onViewDetails={() => handleNavigateToDeliveryDetail(delivery)}
                    />
                ))}
            </div>
        </Card>
    );
};
