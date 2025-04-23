
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ShoppingBag,
    XCircle,
    CheckCircle,
    Clock,
    Utensils,
    Truck,
    CreditCard
} from "lucide-react";
import { useOrderContext } from "@/features/orders/context/OrderContext.tsx";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

const statusIcons = {
    PENDING: <Clock className="w-4 h-4 mr-2 text-yellow-500" />,
    RESTAURANT_ACCEPTED: <Utensils className="w-4 h-4 mr-2 text-blue-500" />,
    DRIVER_ASSIGNED: <Truck className="w-4 h-4 mr-2 text-purple-500" />,
    DELIVERED: <CheckCircle className="w-4 h-4 mr-2 text-green-500" />,
    DELIVERY_FAILED: <XCircle className="w-4 h-4 mr-2 text-red-500" />
};

const statusMessages = {
    PENDING: "Your order is in queue and will be accepted soon",
    RESTAURANT_ACCEPTED: "The restaurant has accepted your order and is preparing it",
    DRIVER_ASSIGNED: "Your order is on the way! A driver has been assigned",
    DELIVERED: "Your order has been successfully delivered",
    DELIVERY_FAILED: "There was an issue with your delivery. Please contact support"
};

const statusSteps = [
    { id: 'PENDING', name: 'Order Placed' },
    { id: 'RESTAURANT_ACCEPTED', name: 'Restaurant Accepted' },
    { id: 'DRIVER_ASSIGNED', name: 'Driver Assigned' },
    { id: 'DELIVERED', name: 'Delivered' }
];

interface IOrderItem {
    itemId: number;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemImage?: string;
}

class IOrder {
    status?: string;
    id?: number;
    createdAt?: string;
    items?: IOrderItem[]=[];
    restaurantName?: string;
    deliveryAddress?: string;
    paymentStatus?: string;
    totalAmount?: number;
}

export default function OrderDetailsPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { loading, error, getOrderById, refreshOrders } = useOrderContext();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [localLoading, setLocalLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                if (!orderId) return;
                const fetchedOrder = await getOrderById(Number(orderId));
                setOrder(fetchedOrder);
            } catch (err) {
                toast.error("Failed to load order details");
            } finally {
                setLocalLoading(false);
            }
        };

        loadOrder();
    }, [orderId, getOrderById]);

    const handlePayment = () => {
        toast.info("Redirecting to payment gateway...");
        // Payment integration would go here
    };

    const handleBack = () => {
        navigate({
            to: "/restaurants",

        });    };

    if (loading || localLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                {Array(3).fill(0).map((_, i) => (
                    <Card key={i} className="p-6 w-full max-w-3xl">
                        <Skeleton className="h-6 w-1/3 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-10 w-full" />
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <XCircle className="h-10 w-10 text-destructive" />
                <p className="text-destructive text-lg">{error}</p>
                <Button variant="outline" onClick={refreshOrders}>
                    Retry
                </Button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">Order not found</p>
                <Button variant="outline" onClick={handleBack}>
                    Back to Orders
                </Button>
            </div>
        );
    }

    const currentStatusIndex =
        statusSteps.findIndex((step) => step.id === order.status) || 0;

    return (
        <div className="container mx-auto py-8 space-y-6 max-w-3xl">
            <Button variant="outline" onClick={handleBack} className="mb-4">
                ← Back to Orders
            </Button>

            <Card className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Order #{order.id}</h2>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                            {statusIcons[order.status as keyof typeof statusIcons]}
                            {new Date(order.createdAt!).toLocaleString()}
                        </div>
                    </div>
                    <Badge
                        variant={
                            order.status === "DELIVERY_FAILED"
                                ? "destructive"
                                : order.status === "DELIVERED"
                                    ? "secondary" // fallback instead of "success"
                                    : "default"
                        }
                    >
                        {order.status?.replace("_", " ")}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold mb-2">Restaurant Details</h3>
                        <p>{order.restaurantName}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Delivery Address</h3>
                        <p>{order.deliveryAddress || "Not specified"}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">Order Items</h3>
                    <ul className="space-y-4">
                        {order.items?.map((item) => (
                            <li key={item.itemId} className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    {item.itemImage && (
                                        <img
                                            src={item.itemImage}
                                            alt={item.itemName}
                                            className="w-16 h-16 rounded-md object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">{item.itemName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} × ${item.unitPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>${order.totalAmount?.toFixed(2)}</span>
                </div>

                {order.paymentStatus === "NOT_PAID" && (
                    <div className="border-t pt-4">
                        <Button onClick={handlePayment} className="w-full" size="lg">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Proceed to Payment
                        </Button>
                    </div>
                )}

                <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Order Status</h3>
                    <div className="relative">
                        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                        {statusSteps.map((step, index) => {
                            const isCompleted = index < currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;
                            const IconComponent = statusIcons[step.id as keyof typeof statusIcons];

                            return (
                                <div key={step.id} className="relative pl-10 pb-6">
                                    <div
                                        className={`absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full 
                    ${isCompleted ? "bg-green-500" : isCurrent ? "bg-blue-500 animate-pulse" : "bg-gray-200"}`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        ) : (
                                            React.cloneElement(IconComponent, {
                                                className: "w-4 h-4 text-white"
                                            })
                                        )}
                                    </div>
                                    <h4 className={`font-medium ${isCurrent ? "text-blue-500" : ""}`}>
                                        {step.name}
                                    </h4>
                                    {isCurrent && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {statusMessages[order.status as keyof typeof statusMessages]}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
        </div>
    );
}

