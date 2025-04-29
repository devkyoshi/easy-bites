import { api } from "@/config/axios";
import {
    IWeeklyStatsResponse,
    IRatingDistributionResponse,
    IDeliveryAnalytics,
    IDeliveryRatingRequest,
    IOrder, IDriverResponse, IDriverProfile
} from "@/services/types/delivery.type.ts";

export const fetchWeeklyStats = async (driverId: number): Promise<IWeeklyStatsResponse[]> => {
    const response = await api.get(`/api/delivery/analytics/weekly?driverId=${driverId}`);
    return response.data.result as IWeeklyStatsResponse[];
};

export const fetchRatingDistribution = async (driverId: number): Promise<IRatingDistributionResponse[]> => {
    const response = await api.get(`/api/delivery/analytics/ratings?driverId=${driverId}`);
    return response.data.result as IRatingDistributionResponse[];
};

export const fetchAverageRating = async (driverId: number): Promise<number> => {
    const response = await api.get(`/api/delivery/analytics/average-rating?driverId=${driverId}`);
    return response.data.result;
};

export const submitDeliveryRating = async (deliveryId: number, data: IDeliveryRatingRequest): Promise<void> => {
    await api.post(`/api/delivery/delivery/${deliveryId}/rate`, data);
};

export const fetchDeliveryAnalytics = async (driverId: number): Promise<IDeliveryAnalytics> => {
    const [weeklyStats, ratingDistribution, averageRating] = await Promise.all([
        fetchWeeklyStats(driverId),
        fetchRatingDistribution(driverId),
        fetchAverageRating(driverId)
    ]);

    return {
        weeklyStats,
        ratingDistribution,
        averageRating,
    };
};

export const fetchOrderDetails = async (orderId: number): Promise<IOrder> => {
    const response = await api.get(`/api/order/order/${orderId}`);
    return response.data as IOrder;
};

export const fetchDriverProfile = async (driverId: number): Promise<IDriverResponse> => {
    const response = await api.get(`/api/delivery/drivers/${driverId}`);
    return response.data.result as IDriverResponse;
};

export const updateDriverProfile = async (
    driverId: number,
    profileData: IDriverProfile
): Promise<IDriverResponse> => {
    const response = await api.put(`/api/delivery/drivers/${driverId}`, profileData);
    return response.data.result as IDriverResponse;
};