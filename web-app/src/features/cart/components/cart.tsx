import {CartProvider, useCart} from "@/features/cart/context/cart-context";

import { Skeleton } from "@/components/ui/skeleton";
import { IconShoppingCart } from "@tabler/icons-react";

export const Cart = () => {
    const { cart, loading } = useCart();

    if (loading) {
        return <Skeleton className="w-8 h-8 rounded-full" />;
    }

    return (
        <CartProvider>
        <div className="relative">
            <IconShoppingCart className="h-6 w-6" />
            {cart && cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
                    {cart.items.length}
                </span>
            )}
        </div>
        </CartProvider>
    );
};
