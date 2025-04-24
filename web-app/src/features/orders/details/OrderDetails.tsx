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
import { ShoppingBag, XCircle, CheckCircle, Clock, Check, Truck } from "lucide-react";
import {IOrder, OrderProvider, useOrderContext} from "@/features/orders/context/OrderContext.tsx";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {useNavigate} from "@tanstack/react-router";
import { useState } from "react";
import { useRef } from "react";
import { jsPDF } from "jspdf";

const statusIcons = {
    PENDING: <Clock className="w-4 h-4 mr-2" />,
    RESTAURANT_ACCEPTED: <Check className="w-4 h-4 mr-2" />,
    DRIVER_ASSIGNED: <Truck className="w-4 h-4 mr-2" />,
    DELIVERED: <CheckCircle className="w-4 h-4 mr-2" />,
    DELIVERY_FAILED: <XCircle className="w-4 h-4 mr-2" />
};

type OrderTab = 'all' | 'pending' | 'restaurant_accepted' | 'driver_assigned' | 'completed' | 'cancelled';

export default function OrdersList() {
    const { orders, loading, error, cancelOrder, refreshOrders } = useOrderContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<OrderTab>('all');

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

    const handleDownloadPdf = (orderId: number) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const pdf = new jsPDF();
        let y = 10;

        pdf.setFontSize(18);
        pdf.text("Order Receipt", 105, y, { align: "center" });

        y += 10;
        pdf.setFontSize(12);
        pdf.text(`Order ID: ${order.id}`, 10, y);
        pdf.text(`Restaurant: ${order.restaurantName}`, 10, y + 8);
        pdf.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 10, y + 16);

        if (order.deliveryAddress) {
            pdf.text(`Delivery Address: ${order.deliveryAddress}`, 10, y + 24);
            y += 8;
        }

        y += 30;
        pdf.setFont("helvetica", "bold");
        pdf.text("Qty", 10, y);
        pdf.text("Item", 30, y);
        pdf.text("Price", 160, y, { align: "right" });

        pdf.setFont("helvetica", "normal");
        y += 6;

        order.items.forEach((item) => {
            pdf.text(`${item.quantity}`, 10, y);
            pdf.text(item.itemName, 30, y);
            pdf.text(`$${item.totalPrice.toFixed(2)}`, 160, y, { align: "right" });
            y += 6;
        });

        y += 4;
        pdf.line(10, y, 200, y);
        y += 8;

        pdf.setFont("helvetica", "bold");
        pdf.text("Total", 30, y);
        pdf.text(`$${order.totalAmount.toFixed(2)}`, 160, y, { align: "right" });

        y += 10;
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(10);
        pdf.text("Thank you for your order!", 105, y, { align: "center" });

        pdf.save(`order-${orderId}-receipt.pdf`);
    };

    // Filter orders based on active tab
    const filteredOrders = orders.filter(order => {
        switch (activeTab) {
            case 'all':
                return true;
            case 'pending':
                return order.status === 'PENDING';
            case 'restaurant_accepted':
                return order.status === 'RESTAURANT_ACCEPTED';
            case 'driver_assigned':
                return order.status === 'DRIVER_ASSIGNED';
            case 'cancelled':
                return order.status === 'CANCELLED';
            case 'completed':
                return order.status === 'DELIVERED' || order.status === 'DELIVERY_FAILED';
            default:
                return true;
        }
    });

    const getOrderCount = (status: string | string[]) => {
        if (Array.isArray(status)) {
            return orders.filter(o => status.includes(o.status)).length;
        }
        return orders.filter(o => o.status === status).length;
    };

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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    <Card
                        className={`p-3 cursor-pointer transition-colors ${activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">All Orders</h3>
                            <Badge variant={activeTab === 'all' ? 'secondary' : 'default'} className="text-xs">
                                {orders.length}
                            </Badge>
                        </div>
                    </Card>

                    <Card
                        className={`p-3 cursor-pointer transition-colors ${activeTab === 'pending' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">Pending</h3>
                            <Badge variant={activeTab === 'pending' ? 'secondary' : 'default'} className="text-xs">
                                {getOrderCount('PENDING')}
                            </Badge>
                        </div>
                    </Card>

                    <Card
                        className={`p-3 cursor-pointer transition-colors ${activeTab === 'restaurant_accepted' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        onClick={() => setActiveTab('restaurant_accepted')}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">Accepted</h3>
                            <Badge variant={activeTab === 'restaurant_accepted' ? 'secondary' : 'default'} className="text-xs">
                                {getOrderCount('RESTAURANT_ACCEPTED')}
                            </Badge>
                        </div>
                    </Card>

                    <Card
                        className={`p-3 cursor-pointer transition-colors ${activeTab === 'driver_assigned' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        onClick={() => setActiveTab('driver_assigned')}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">Driver Assigned</h3>
                            <Badge variant={activeTab === 'driver_assigned' ? 'secondary' : 'default'} className="text-xs">
                                {getOrderCount('DRIVER_ASSIGNED')}
                            </Badge>
                        </div>
                    </Card>

                    <Card
                        className={`p-3 cursor-pointer transition-colors ${activeTab === 'completed' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">Completed</h3>
                            <Badge variant={activeTab === 'completed' ? 'secondary' : 'default'} className="text-xs">
                                {getOrderCount(['DELIVERED', 'DELIVERY_FAILED'])}
                            </Badge>
                        </div>
                    </Card>
                    <Card
                        className={`p-3 cursor-pointer transition-colors ${activeTab === 'cancelled' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        onClick={() => setActiveTab('cancelled')}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">Cancelled</h3>
                            <Badge variant={activeTab === 'cancelled' ? 'secondary' : 'default'} className="text-xs">
                                {getOrderCount('CANCELLED')}
                            </Badge>
                        </div>
                    </Card>



                </div>
                {activeTab === 'cancelled' && (
                    <div className="text-sm text-muted-foreground text-center">
                        Cancelled orders will disappear after 24 hours.
                    </div>
                )}

                {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                        <p className="text-muted-foreground text-lg">
                            {activeTab === 'all' ? 'No orders found' :
                                activeTab === 'pending' ? 'No pending orders' :
                                    activeTab === 'restaurant_accepted' ? 'No accepted orders' :
                                        activeTab === 'driver_assigned' ? 'No orders with driver assigned' :
                                            'No completed orders'}
                        </p>
                        <Button variant="outline">
                            Browse Restaurants
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
                                    <Badge variant={
                                        order.status === "DELIVERY_FAILED" ? "destructive" :
                                            order.status === "CANCELLED" ? "destructive" :
                                                order.status === "DELIVERED" ? "default" :
                                                order.status === "PENDING" ? "secondary" :
                                                    order.status === "RESTAURANT_ACCEPTED" ? "outline" :
                                                        "default"
                                    }>
                                        {order.status.replace(/_/g, ' ').toLowerCase()}
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
                                    {order.status !== "CANCELLED" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                        >
                                            Pay
                                        </Button>
                                    )}

                                    {order.status === "PENDING" && (
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
                                    )}

                                    {(order.status === "DELIVERED" || order.status === "RESTAURANT_ACCEPTED" || order.status === "DRIVER_ASSIGNED") && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownloadPdf(order.id);
                                            }}
                                        >
                                            Download Receipt
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </OrderProvider>
    );
}