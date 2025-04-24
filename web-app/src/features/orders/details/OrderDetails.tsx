// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ShoppingBag, XCircle, CheckCircle, Clock } from "lucide-react";
// import {IOrder, OrderProvider, useOrderContext} from "@/features/orders/context/OrderContext.tsx";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import {useNavigate} from "@tanstack/react-router";
//
// const statusIcons = {
//     PENDING: <Clock className="w-4 h-4 mr-2" />,
//     DELIVERED: <CheckCircle className="w-4 h-4 mr-2" />,
//     DELIVERY_FAILED: <XCircle className="w-4 h-4 mr-2" />
// };
//
// export default function OrdersList() {
//     const { orders, loading, error, cancelOrder, refreshOrders } = useOrderContext();
//     const navigate = useNavigate();
//
//     const handleCancel = async (orderId: number) => {
//         try {
//             await cancelOrder(orderId);
//             toast.success("Order cancelled successfully");
//             await refreshOrders();
//         } catch {
//             toast.error("Failed to cancel order");
//         }
//     };
//
//     const handleViewDetails = (id: IOrder) => {
//         navigate({
//             to: `/orders/order-details`,
//             state: { orderId: id },
//         }).then();
//     };
//
//
//     if (loading) {
//         return (
//             <div className="flex flex-col items-center justify-center h-64 space-y-4">
//                 {Array(3).fill(0).map((_, i) => (
//                     <Card key={i} className="p-6 w-full max-w-3xl">
//                         <Skeleton className="h-6 w-1/3 mb-4" />
//                         <Skeleton className="h-4 w-full mb-2" />
//                         <Skeleton className="h-4 w-2/3 mb-4" />
//                         <Skeleton className="h-10 w-full" />
//                     </Card>
//                 ))}
//             </div>
//         );
//     }
//
//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center h-64 space-y-4">
//                 <XCircle className="h-10 w-10 text-destructive" />
//                 <p className="text-destructive text-lg">{error}</p>
//                 <Button variant="outline" onClick={refreshOrders}>
//                     Retry
//                 </Button>
//             </div>
//         );
//     }
//
//     if (orders.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center h-64 space-y-4">
//                 <ShoppingBag className="h-10 w-10 text-muted-foreground" />
//                 <p className="text-muted-foreground text-lg">No past orders found</p>
//                 <Button variant="outline">Browse Restaurants</Button>
//             </div>
//         );
//     }
//
//     return (
//         <OrderProvider>
//
//
//         <div className="container mx-auto py-8 space-y-6 max-w-3xl">
//             <h2 className="text-2xl font-bold">Your Orders</h2>
//
//             <div className="space-y-4">
//                 {orders.map((order) => (
//                     <Card
//                         key={order.id}
//                         className="p-6 space-y-4 hover:shadow-md transition-shadow cursor-pointer"
//                         onClick={() => handleViewDetails(order.id)}
//                     >
//                         <div className="flex justify-between items-center">
//                             <div>
//                                 <p className="font-semibold">{order.restaurantName}</p>
//                                 <div className="flex items-center text-sm text-muted-foreground">
//                                     {statusIcons[order.status as keyof typeof statusIcons]}
//                                     {new Date(order.createdAt).toLocaleString()}
//                                 </div>
//                                 {order.deliveryAddress && (
//                                     <div className="text-sm text-muted-foreground mt-1">
//                                         Delivery to: {order.deliveryAddress}
//                                     </div>
//                                 )}
//                             </div>
//                             <Badge variant={order.status === "cancelled" ? "destructive" : "default"}>
//                                 {order.status}
//                             </Badge>
//                         </div>
//
//                         <ul className="space-y-2">
//                             {order.items.slice(0, 2).map((item) => (  // Show only first 2 items in list view
//                                 <li key={item.itemId} className="flex justify-between">
//                                     <div className="flex items-center gap-3">
//                                         {item.itemImage && (
//                                             <img
//                                                 src={item.itemImage}
//                                                 alt={item.itemName}
//                                                 className="w-10 h-10 rounded-md object-cover"
//                                             />
//                                         )}
//                                         <span>{item.quantity}x {item.itemName}</span>
//                                     </div>
//                                     <span>${item.totalPrice.toFixed(2)}</span>
//                                 </li>
//                             ))}
//                             {order.items.length > 2 && (
//                                 <li className="text-sm text-muted-foreground">
//                                     +{order.items.length - 2} more items...
//                                 </li>
//                             )}
//                         </ul>
//
//                         <div className="flex justify-between font-bold pt-4 border-t">
//                             <span>Total</span>
//                             <span>${order.totalAmount.toFixed(2)}</span>
//                         </div>
//
//                         {order.status === "PENDING" && (
//                             <div className="flex justify-end pt-2 gap-2">
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleViewDetails(order.id);
//                                     }}
//                                 >
//                                     View Details
//                                 </Button>
//                                 <Button
//                                     variant="destructive"
//                                     size="sm"
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleCancel(order.id);
//                                     }}
//                                 >
//                                     Cancel Order
//                                 </Button>
//                             </div>
//                         )}
//                     </Card>
//                 ))}
//             </div>
//         </div>
//         </OrderProvider>
//     );
// }
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, XCircle, CheckCircle, Clock } from "lucide-react";
import {IOrder, OrderProvider, useOrderContext} from "@/features/orders/context/OrderContext.tsx";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {useNavigate} from "@tanstack/react-router";
import { useState } from "react";

const statusIcons = {
    PENDING: <Clock className="w-4 h-4 mr-2" />,
    DELIVERED: <CheckCircle className="w-4 h-4 mr-2" />,
    DELIVERY_FAILED: <XCircle className="w-4 h-4 mr-2" />
};

export default function OrdersList() {
    const { orders, loading, error, cancelOrder, refreshOrders } = useOrderContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

    const handleCancel = async (orderId: number) => {
        try {
            await cancelOrder(orderId);
            toast.success("Order cancelled successfully");
            await refreshOrders();
        } catch {
            toast.error("Failed to cancel order");
        }
    };

    const handleViewDetails = (id: IOrder) => {
        navigate({
            to: `/orders/order-details`,
            state: { orderId: id },
        }).then();
    };

    // Filter orders based on active tab
    const filteredOrders = orders.filter(order => {
        if (activeTab === 'pending') {
            return order.status === 'PENDING';
        } else {
            return order.status === 'DELIVERED' || order.status === 'DELIVERY_FAILED';
        }
    });

    if (loading) {
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

    return (
        <OrderProvider>
            <div className="container mx-auto py-8 space-y-6 max-w-3xl">
                <h2 className="text-2xl font-bold">Your Orders</h2>

                {/* Order Status Tabs */}
                <div className="flex gap-4">
                    <Card
                        className={`p-4 flex-1 cursor-pointer transition-colors ${activeTab === 'pending' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Pending Orders</h3>
                            <Badge variant={activeTab === 'pending' ? 'secondary' : 'default'}>
                                {orders.filter(o => o.status === 'PENDING').length}
                            </Badge>
                        </div>
                        <p className="text-sm mt-2">Orders that are being processed</p>
                    </Card>

                    <Card
                        className={`p-4 flex-1 cursor-pointer transition-colors ${activeTab === 'completed' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Completed Orders</h3>
                            <Badge variant={activeTab === 'completed' ? 'secondary' : 'default'}>
                                {orders.filter(o => o.status === 'DELIVERED' || o.status === 'DELIVERY_FAILED').length}
                            </Badge>
                        </div>
                        <p className="text-sm mt-2">Past delivered orders</p>
                    </Card>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                        <p className="text-muted-foreground text-lg">
                            {activeTab === 'pending' ? 'No pending orders' : 'No completed orders'}
                        </p>
                        <Button variant="outline">
                            {activeTab === 'pending' ? 'Browse Restaurants' : 'View Pending Orders'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <Card
                                key={order.id}
                                className="p-6 space-y-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleViewDetails(order.id)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{order.restaurantName}</p>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            {statusIcons[order.status as keyof typeof statusIcons]}
                                            {new Date(order.createdAt).toLocaleString()}
                                        </div>
                                        {order.deliveryAddress && (
                                            <div className="text-sm text-muted-foreground mt-1">
                                                Delivery to: {order.deliveryAddress}
                                            </div>
                                        )}
                                    </div>
                                    <Badge variant={order.status === "DELIVERY_FAILED" ? "destructive" : "default"}>
                                        {order.status}
                                    </Badge>
                                </div>

                                <ul className="space-y-2">
                                    {order.items.slice(0, 2).map((item) => (
                                        <li key={item.itemId} className="flex justify-between">
                                            <div className="flex items-center gap-3">
                                                {item.itemImage && (
                                                    <img
                                                        src={item.itemImage}
                                                        alt={item.itemName}
                                                        className="w-10 h-10 rounded-md object-cover"
                                                    />
                                                )}
                                                <span>{item.quantity}x {item.itemName}</span>
                                            </div>
                                            <span>${item.totalPrice.toFixed(2)}</span>
                                        </li>
                                    ))}
                                    {order.items.length > 2 && (
                                        <li className="text-sm text-muted-foreground">
                                            +{order.items.length - 2} more items...
                                        </li>
                                    )}
                                </ul>

                                <div className="flex justify-between font-bold pt-4 border-t">
                                    <span>Total</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>

                                {order.status === "PENDING" && (
                                    <div className="flex justify-end pt-2 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewDetails(order.id);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancel(order.id);
                                            }}
                                        >
                                            Cancel Order
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </OrderProvider>
    );
}