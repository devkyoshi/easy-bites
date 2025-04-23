import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useOrderContext } from "@/features/orders/context/OrderContext";
import { Button } from "@/components/ui/button";

export default function OrdersList() {
    const { orders, loading, error } = useOrderContext();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-destructive">{error}</p>
                <Button variant="outline">Try Again</Button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-muted-foreground text-lg">No orders found</p>
                <Button asChild variant="outline">
                    <Link to="/">Browse Restaurants</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl py-6 space-y-4">
            <h2 className="text-2xl font-bold">Recent Orders</h2>

            <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                    <Card key={order.id} className="p-4 hover:bg-accent transition-colors">
                        <Link to={`/orders/${order.id}`} className="block">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{order.restaurantName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()} • ${order.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={order.status === "cancelled" ? "destructive" : "default"}>
                                        {order.status}
                                    </Badge>
                                    <span className="text-muted-foreground text-sm">
                                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </Card>
                ))}
            </div>

            {orders.length > 3 && (
                <div className="flex justify-center">
                    <Button asChild variant="ghost">
                        <Link to="/orders" className="text-primary">
                            View All Orders
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}