// features/cart/context/cart-context.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/config/axios";
import { useAuth } from "@/stores/auth-context.tsx";

export interface ICartItem {
    restaurantName: string;
    restaurantId: string;
    itemImage?: string;
    name: string | undefined;
    itemId: number;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl?: string;
}

interface ICart {
    id: number;
    cartId: string;
    userId: string;
    restaurantId: string;
    restaurantName: string;
    items: ICartItem[];
    totalAmount: number;
    status: string;
}

interface CartContextType {
    cart: ICart | null;
    loading: boolean;
    addItem: (item: {
        itemId: number;
        itemName: string;
        itemImage: string | undefined;
        quantity: number;
        unitPrice: number;
        restaurantId: string;
        restaurantName: string
    }) => Promise<void>;
    updateItem: (item: UpdateItemRequest) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    decrementItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    checkout: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface AddItemRequest {
    itemId: number;
    itemName: string;
    itemImage?: string;
    quantity: number;
    unitPrice: number;
    restaurantId: string;
    restaurantName: string;
}

interface UpdateItemRequest {
    itemId: number;
    quantity: number;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<ICart | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const fetchCart = async () => {
        if (!currentUser?.userId) return;

        setLoading(true);
        try {
            const res = await api.get(`/api/order/users/${currentUser.userId}/active`);
            setCart(res.data);

        } catch (error) {
            console.error("Failed to fetch cart:", error);
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (item: AddItemRequest) => {
        {
            try {
                const res = await api.post("/api/order/add-or-create", {
                    userId: currentUser?.userId,
                    items: [{
                        itemId: item.itemId,
                        itemName: item.itemName,
                        itemImage: item.itemImage,
                        restaurantId: item.restaurantId,
                        restaurantName: item.restaurantName,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice
                    }]
                });
                setCart(res.data);
            } catch (error) {
                console.error("Failed to add item:", error);
                throw error;
            }
        }
    };

    const updateItem = async (item: UpdateItemRequest) => {
        if (!cart) return;

        try {
            const res = await api.put(`/api/order/${cart.id}/items`, {
                itemId: item.itemId,
                quantity: item.quantity
            });
            setCart(res.data);
        } catch (error) {
            console.error("Failed to update item:", error);
            throw error;
        }
    };

    const removeItem = async (itemId: number) => {
        if (!cart) return;

        try {
            const res = await api.delete(`/api/order/${cart.id}/items`, {
                data: { itemId }
            });
            setCart(res.data);
        } catch (error) {
            console.error("Failed to remove item:", error);
            throw error;
        }
    };

    const decrementItem = async (itemId: number) => {
        if (!cart) return;

        try {
            const res = await api.delete(`/api/order/${cart.id}/items/decrement`, {
                data: { itemId }
            });
            setCart(res.data);
        } catch (error) {
            console.error("Failed to decrement item:", error);
            throw error;
        }
    };

    const clearCart = async () => {
        if (!cart) return;

        try {
            const res = await api.delete(`/api/order/${cart.id}/clear`);
            setCart(res.data);
        } catch (error) {
            console.error("Failed to clear cart:", error);
            throw error;
        }
    };

    const checkout = async () => {
        if (!cart) return;

        try {
            const res = await api.post(`/api/order/${cart.id}/checkout`);
            setCart(res.data);
        } catch (error) {
            console.error("Failed to checkout:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchCart();
    }, [currentUser?.userId]);

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addItem,
            updateItem,
            removeItem,
            decrementItem,
            clearCart,
            checkout,
            refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};