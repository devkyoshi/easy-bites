export interface IDeliveryAcceptanceRequest {
    orderId: number;
    currentLat: number;
    currentLng: number;
}

export interface IDeliveryCompletionRequest {
    notes: string;
    proofImage?: string;
    isCompleted: boolean;
}

export interface IDeliveryRatingRequest {
    rating: number;
    comment: string;
}

export interface IDeliveryResponse {
    deliveryAddress: string;
    restaurantName: string;
    deliveryId: number;
    orderId: number;
    driverId: number;
    status: string;
    notes?: string;
    proofImage?: string;
    rating?: number;
    ratingComment?: string;
    createdAt: string;
    updatedAt: string;
    pickupLat: number;
    pickupLng: number;
    deliveryLat: number;
    deliveryLng: number;
    currentLat: number;
    currentLng: number;
}

export interface IDriverProfile {
    vehicleType: string;
    vehicleNumber: string;
    licenseNumber: string;
}

export interface IDriverResponse {
    licenseNumber: string;
    driverId: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    roles: string;
    createdAt: string;
    updatedAt: string;
    vehicleType: string;
    vehicleNumber: string;
    isAvailable: boolean;
    currentLat: number;
    currentLng: number;
}

export interface IRatingDistributionResponse {
    rating: number;
    count: number;
}

export interface IWeeklyStatsResponse {
    day: string;
    deliveryCount: number;
    totalEarnings: number;
}

export interface IOrder {
    id: number;
    userId: number;
    items: {
        itemId: number;
        itemName: string;
        itemImage: string;
        restaurantId: number;
        restaurantName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }[];
    totalAmount: number;
    status: 'PENDING' | 'RESTAURANT_ACCEPTED' | 'DRIVER_ASSIGNED' | 'DELIVERED' | 'DELIVERY_FAILED';
    paymentStatus: string;
    deliveryAddress: string;
    createdAt: string;
    updatedAt: string;
}

export interface ILocation {
    lat: number;
    lng: number;
    timestamp?: number;
    accuracy?: number;
}

export interface IDeliveryAnalytics {
    weeklyStats: IWeeklyStatsResponse[];
    ratingDistribution: IRatingDistributionResponse[];
    averageRating: number;
}