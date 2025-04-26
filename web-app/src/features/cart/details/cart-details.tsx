// features/cart/components/cart-details.tsx
import { useCart } from "@/features/cart/context/cart-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import {toast} from "sonner";
import {useNavigate} from "@tanstack/react-router";
import {api} from "@/config/axios.ts";
import {useState} from "react";

export default function CartDetails() {
    const {
        cart,
        loading,
        addItem,
        updateItem,
        removeItem,
        decrementItem,
        clearCart,
        checkout
    } = useCart();
    const navigate = useNavigate();
    const [deliveryAddress, setDeliveryAddress] = useState("");

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading your cart...</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">Your cart is empty</p>
                <Button variant="outline">Browse Restaurants</Button>
            </div>
        );
    }

    const handleCheckout = async () => {
        try {
            await checkout();
            const response = await api.post("/api/order/order", {
                cartId: cart.id,
                deliveryAddress
            });
            console.log(response);

            toast("Order placed successfully!");
            navigate({
                to: "/orders",

            });
        } catch (error) {
            toast(
                 "Checkout failed",

            );
        }
    };


    return (
        <div className="container mx-auto py-8 space-y-6 max-w-3xl">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Cart from {cart.restaurantName}</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive"
                >
                    Clear Cart
                </Button>
            </div>

            <div className="space-y-4">
                {cart.items.map((item) => (
                    <Card key={item.itemId} className="p-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <img
                                    src={item.itemImage}
                                    alt={item.name}
                                    className="w-24 h-24 rounded-md object-cover"
                                />

                                <p className="text-sm text-muted-foreground">
                                    ${item.unitPrice.toFixed(2)} each
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => decrementItem(item.itemId)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>

                                    <Input
                                        className="w-12 h-8 text-center"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const newQty = parseInt(e.target.value);
                                            if (!isNaN(newQty) && newQty > 0) {
                                                updateItem({ itemId: item.itemId, quantity: newQty });
                                            }
                                        }}
                                    />

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => addItem({
                                            itemId: item.itemId,
                                            itemName: item.itemName,
                                            itemImage: item.imageUrl,
                                            quantity: 1,
                                            unitPrice: item.unitPrice,
                                            restaurantId: cart.restaurantId,
                                            restaurantName: cart.restaurantName
                                        })}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive h-8 w-8 p-0"
                                    onClick={() => removeItem(item.itemId)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <Badge variant="outline" className="px-2 py-1">
                                ${item.totalPrice.toFixed(2)}
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-6 space-y-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>$2.99</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(cart.totalAmount + 2.99).toFixed(2)}</span>
                </div>
            </Card>
            <Input
                placeholder="Enter delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full"
            />
            <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={!deliveryAddress.trim()}
            >
                Proceed to Checkout
            </Button>
        </div>
    );
}