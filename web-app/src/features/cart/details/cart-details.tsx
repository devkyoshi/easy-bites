// features/cart/components/cart-details.tsx
import {ICartItem, useCart} from "@/features/cart/context/cart-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/config/axios.ts";
import {useEffect, useState} from "react";

export type GroupedItems = {
    [restaurantId: string]: {
        restaurantName: string;
        items: ICartItem[];
    };
};
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
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [ward, setWard] = useState("");
    const [tole, setTole] = useState("");

    useEffect(() => {
        const combined = `${tole}, Ward ${ward}, ${municipality}, ${district}, ${province}`;
        setDeliveryAddress(combined.trim());
    }, [province, district, municipality, ward, tole]);

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

    const groupedItems = cart.items.reduce((acc: GroupedItems, item) => {
        if (!acc[item.restaurantId]) {
            acc[item.restaurantId] = {
                restaurantName: item.restaurantName,
                items: []
            };
        }
        acc[item.restaurantId].items.push(item);
        return acc;
    }, {});

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
        } catch (_error) {
            toast("Checkout failed");
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6 max-w-3xl">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive"
                >
                    Clear Cart
                </Button>
            </div>

            <div className="space-y-8">
                {Object.entries(groupedItems).map(([restaurantId, group]) => (
                    <div key={restaurantId} className="space-y-4">
                        <h3 className="text-xl font-semibold">{group.restaurantName}</h3>

                        {group.items.map((item) => (
                            <Card key={item.itemId} className="p-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex gap-4">
                                        <img
                                            src={item.itemImage}
                                            alt={item.name}
                                            className="w-24 h-24 rounded-md object-cover"
                                        />
                                        <div className="space-y-1">
                                            <h4 className="font-medium">{item.itemName}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                ${item.unitPrice.toFixed(2)} each
                                            </p>
                                        </div>
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
                                                    itemImage: item.itemImage,
                                                    quantity: 1,
                                                    unitPrice: item.unitPrice,
                                                    restaurantId: item.restaurantId,
                                                    restaurantName: item.restaurantName
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
                                        Total ${item.totalPrice.toFixed(2)}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                ))}
            </div>

            <Card className="p-6 space-y-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(cart.totalAmount ).toFixed(2)}</span>
                </div>
            </Card>
            <div className="text-sm text-muted-foreground text-center">
                Please note that if u provide false information, your order will be rejected.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Province" value={province} onChange={(e) => setProvince(e.target.value)} />
                <Input placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
                <Input placeholder="Municipality" value={municipality} onChange={(e) => setMunicipality(e.target.value)} />
                <Input placeholder="Ward" value={ward} onChange={(e) => setWard(e.target.value)} />
                <Input placeholder="Tole / Street" value={tole} onChange={(e) => setTole(e.target.value)} />
            </div>

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