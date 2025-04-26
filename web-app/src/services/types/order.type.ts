// src/services/types/order.type.ts
export interface IOrderItem {
    itemId: number;
    itemName: string;
    itemImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface IOrderDetails {
    id: number;
    restaurantId: number;
    restaurantName: string;
    restaurantLogo: string;
    status: 'PENDING' | 'DELIVERED' | 'DELIVERY_FAILED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
    deliveryAddress: string;
    deliveryInstructions?: string;
    contactPhone: string;
    estimatedDeliveryTime?: string;
    items: IOrderItem[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
}