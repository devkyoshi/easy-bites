import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/config/axios";
import { useAuth } from "@/stores/auth-context.tsx";

interface IOrderItem {
    itemId: number;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemImage?: string;
}

export interface IOrder {
    id: number;
    userId: string;
    restaurantId: string;
    restaurantName: string;
    items: IOrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
    deliveryAddress?: string;
}

interface OrderContextType {
    orders: IOrder[];
    loading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    cancelOrder: (orderId: number) => Promise<void>;
    getOrderById: (orderId: number) => Promise<IOrder | null>;
    refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        if (!currentUser?.userId) return;

        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/api/order/users/${currentUser.userId}`);
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError("Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId: number) => {
        try {
            setLoading(true);
            await api.patch(`/api/order/${orderId}/cancel`);
            await fetchOrders(); // Refresh the list
        } catch (err) {
            console.error("Failed to cancel order:", err);
            setError("Failed to cancel order");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentUser?.userId]);

    const getOrderById = async (orderId: number): Promise<IOrder | null> => {
        try {
            const res = await api.get(`/api/order/order/${orderId}`);
            return res.data;
        } catch (err) {
            console.error("Failed to fetch order:", err);
            setError("Failed to load order details");
            return null;
        }
    };


    return (
        <OrderContext.Provider value={{
            orders,
            loading,
            error,
            fetchOrders,
            cancelOrder,
            getOrderById,
            refreshOrders: fetchOrders
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrderContext = (): OrderContextType => {
    const context = useContext(OrderContext);
    if (!context) throw new Error("useOrderContext must be used within an OrderProvider");
    return context;
};