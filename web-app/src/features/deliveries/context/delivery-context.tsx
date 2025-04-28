import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket, disconnectSocket } from "@/services/socket-service";
import { api } from "@/config/axios";
import {
    IDriverResponse,
    ILocation,
    IOrder,
    IDeliveryResponse,
    IDeliveryAcceptanceRequest,
    IDeliveryCompletionRequest,
    IRatingDistributionResponse,
    IWeeklyStatsResponse, IDeliveryAnalytics
} from "@/services/types/delivery.type";
import Socket = SocketIOClient.Socket;
import {fetchDeliveryAnalytics} from "@/services/delivery-service.ts";
import axios from "axios";

interface IDeliveryContext {
    driver: IDriverResponse | null;
    currentLocation: ILocation | null;
    nearbyOrders: IOrder[];
    activeDelivery: IDeliveryResponse | null;
    analytics: {
        weeklyStats: IWeeklyStatsResponse[];
        ratingDistribution: IRatingDistributionResponse[];
        averageRating: number;
    } | null;
    loading: boolean;
    error: string | null;
    socketConnected: boolean;
    initializeDriver: (driverId: number, initialLocation?: ILocation, options?: { signal?: AbortSignal }) => Promise<void>;
    updateLocation: (location: ILocation) => Promise<void>;
    acceptOrder: (request: IDeliveryAcceptanceRequest) => Promise<IDeliveryResponse | null>;
    completeDelivery: (deliveryId: number, data: IDeliveryCompletionRequest) => Promise<IDeliveryResponse | null>;
    refreshData: () => Promise<void>;
    deliveryHistory: IDeliveryResponse[];
    getDelivery: (deliveryId: number) => IDeliveryResponse | undefined;
    fetchDeliveryHistory: (driverId: number, options?: { signal?: AbortSignal }) => Promise<void>;
    fetchAnalyticsData: (driverId: number, options?: { signal?: AbortSignal }) => Promise<IDeliveryAnalytics>;
}

const DeliveryContext = createContext<IDeliveryContext | undefined>(undefined);

export const DeliveryProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [state, setState] = useState<Omit<IDeliveryContext,
        'initializeDriver' | 'updateLocation' | 'acceptOrder' | 'completeDelivery' | 'refreshData' |
        'getDelivery' | 'fetchDeliveryHistory' | 'fetchAnalyticsData'
    >>({
        driver: null,
        currentLocation: null,
        nearbyOrders: [],
        activeDelivery: null,
        deliveryHistory: [],
        analytics: null,
        loading: true,
        error: null,
        socketConnected: false
    });

    const [socket, setSocket] = useState<Socket | null>(null);

    const fetchDriver = async (
        driverId: number,
        options?: { signal?: AbortSignal }
    ): Promise<IDriverResponse> => {
        try {
            const response = await api.get(`/api/delivery/drivers/${driverId}`, {
                signal: options?.signal
            });
            return response.data.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
                throw error;
            }
            throw new Error(`Failed to fetch driver: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const fetchNearbyOrders = async (driverId: number, lat: number, lng: number): Promise<IOrder[]> => {
        try {
            const response = await api.get(`/api/delivery/orders/nearby`, {  // Changed to proper endpoint format
                params: { driverId, lat, lng },
            });
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch nearby orders", error);
            return [];
        }
    };

    const fetchActiveDelivery = async (
        driverId: number,
        options?: { signal?: AbortSignal }
    ): Promise<IDeliveryResponse | null> => {
        try {
            const response = await api.get(`/api/delivery/delivery/active`, {  // Changed to proper endpoint format
                params: { driverId },
                signal: options?.signal
            });
            return response.data.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
                throw error;
            }
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            console.error("Failed to fetch active delivery", error);
            throw error;
        }
    };

    const fetchAnalytics = async (
        driverId: number,
        options?: { signal?: AbortSignal }
    ) => {
        try {
            return await fetchDeliveryAnalytics(driverId);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Analytics fetch canceled:', error.message);
                throw error;
            }
            console.error("Failed to fetch analytics", error);
            throw error;
        }
    };

    const updateLocation = async (location: ILocation) => {
        if (!state.driver) return;

        try {
            await api.put(`/api/delivery/drivers/${state.driver.driverId}/location`, {
                lat: location.lat,
                lng: location.lng
            });

            setState(prev => ({
                ...prev,
                currentLocation: location
            }));

            if (socket?.connected) {
                socket.emit('locationUpdate', location);
            }

            const nearbyOrders = await fetchNearbyOrders(
                state.driver.driverId,
                location.lat,
                location.lng
            );
            setState(prev => ({ ...prev, nearbyOrders }));
        } catch (error) {
            console.error('Location update failed:', error);
            throw error;
        }
    };

    const initializeDriver = async (driverId: number, initialLocation?: ILocation, options?: { signal?: AbortSignal }): Promise<void> => {
        if (state.loading) return;

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            if (!socket) {
                const sock = initializeSocket(driverId);
                setSocket(sock);

                const handleConnect = () => {
                    setState(prev => ({ ...prev, socketConnected: true }));
                    console.log('Socket connected');
                };

                const handleDisconnect = () => {
                    setState(prev => ({ ...prev, socketConnected: false }));
                    console.log('Socket disconnected');
                };

                const handleNewOrder = (order: IOrder) => {
                    setState(prev => ({
                        ...prev,
                        nearbyOrders: [...prev.nearbyOrders, order]
                    }));
                };

                const handleOrderAccepted = (delivery: IDeliveryResponse) => {
                    if (delivery.driverId === driverId) {
                        setState(prev => ({
                            ...prev,
                            activeDelivery: delivery,
                            nearbyOrders: prev.nearbyOrders.filter(o => o.id !== delivery.orderId),
                            driver: prev.driver ? { ...prev.driver, isAvailable: false } : null
                        }));
                    }
                };

                const handleOrderCompleted = () => {
                    setState(prev => ({
                        ...prev,
                        driver: prev.driver ? { ...prev.driver, isAvailable: true } : null
                    }));
                };

                sock.on('connect', handleConnect);
                sock.on('disconnect', handleDisconnect);
                sock.on('newOrder', handleNewOrder);
                sock.on('orderAccepted', handleOrderAccepted);
                sock.on('orderCompleted', handleOrderCompleted);

                // Cleanup listeners when the component unmounts or socket disconnects
                return () => {
                    sock.off('connect', handleConnect);
                    sock.off('disconnect', handleDisconnect);
                    sock.off('newOrder', handleNewOrder);
                    sock.off('orderAccepted', handleOrderAccepted);
                    sock.off('orderCompleted', handleOrderCompleted);
                };
            }

            const [driver, activeDelivery] = await Promise.all([
                fetchDriver(driverId, options),
                fetchActiveDelivery(driverId, options),
            ]);

            const nearbyOrders = initialLocation
                ? await fetchNearbyOrders(driverId, initialLocation.lat, initialLocation.lng)
                : [];

            setState(prev => ({
                ...prev,
                driver,
                currentLocation: initialLocation || null,
                activeDelivery,
                nearbyOrders,
                loading: false
            }));
        } catch (error) {
            if (!options?.signal?.aborted) {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: "Failed to initialize driver data"
                }));
            }
            console.error("Error initializing driver:", error);
            // Optionally, rethrow or handle errors in a more user-friendly manner.
        }
    };

    const fetchDeliveryHistory = async (driverId: number, options?: { signal?: AbortSignal }) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await api.get(`/api/delivery/delivery/history`, {
                params: { driverId },
                signal: options?.signal
            });
            setState(prev => ({
                ...prev,
                deliveryHistory: response.data.data,
                loading: false
            }));
        } catch (error) {
            if (error instanceof Error) {
                console.error("Failed to fetch delivery history", error.message);
            } else {
                console.error("An unknown error occurred", error);
            }
            setState(prev => ({
                ...prev,
                loading: false,
                error: "Failed to load delivery history"
            }));
        }
    };

    const getDelivery = (deliveryId: number): IDeliveryResponse | undefined => {
        return state.deliveryHistory.find(d => d.driverId === deliveryId) || undefined;
    };

    const acceptOrder = async (request: IDeliveryAcceptanceRequest) => {
        if (!state.driver || !state.currentLocation) return null;

        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await api.post<{ data: IDeliveryResponse }>(
                `/api/delivery/orders/accept`,
                {
                    ...request,
                    currentLat: state.currentLocation.lat,
                    currentLng: state.currentLocation.lng
                },
            );

            const delivery = response.data.data;
            setState(prev => ({
                ...prev,
                activeDelivery: delivery,
                nearbyOrders: prev.nearbyOrders.filter(o => o.id !== delivery.orderId),
                loading: false
            }));

            return delivery;
        } catch (error) {
            console.error("Failed to accept order", error);
            setState(prev => ({ ...prev, loading: false }));
            throw error;
        }
    };

    const completeDelivery = async (deliveryId: number, data: IDeliveryCompletionRequest) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await api.post<{ data: IDeliveryResponse }>(
                `/api/delivery/delivery/complete`,
                data,
                {
                    params: { deliveryId }
                }
            );

            const delivery = response.data.data;
            setState(prev => ({
                ...prev,
                activeDelivery: null,
                loading: false
            }));

            if (state.driver) {
                const analytics = await fetchAnalytics(state.driver.driverId);
                setState(prev => ({ ...prev, analytics }));
            }

            return delivery;
        } catch (error) {
            console.error("Failed to complete delivery", error);
            setState(prev => ({ ...prev, loading: false }));
            throw error;
        }
    };

    const fetchAnalyticsData = async (driverId: number, options?: { signal?: AbortSignal }) => {
        if (!state.loading) {
            setState(prev => ({ ...prev, loading: true }));
        }

        try {
            const analytics = await fetchAnalytics(driverId, options);
            if (!analytics) {
                throw new Error("Failed to fetch analytics");
            }

            setState(prev => ({ ...prev, analytics, loading: false }));
            return analytics;
        } catch (error) {
            console.error("Failed to fetch analytics", error);
            setState(prev => ({
                ...prev,
                error: "Failed to load analytics",
                loading: false
            }));
            throw error;
        }
    };

    const refreshData = async () => {
        if (!state.driver || !state.currentLocation) return; // Check for null first

        const driverId = state.driver.driverId;

        setState(prev => ({ ...prev, loading: true }));
        try {
            const [activeDelivery, analytics, nearbyOrders] = await Promise.all([
                fetchActiveDelivery(driverId),
                fetchAnalytics(driverId),
                fetchNearbyOrders(
                    driverId,
                    state.currentLocation.lat, // Safe to access now
                    state.currentLocation.lng  // Safe to access now
                )
            ]);

            setState(prev => ({
                ...prev,
                activeDelivery,
                analytics,
                nearbyOrders,
                loading: false
            }));
        } catch (error) {
            console.error("Failed to refresh data", error);
            setState(prev => ({ ...prev, loading: false }));
            throw error;
        }
    };

    useEffect(() => {
        return () => {
            if (socket) {
                disconnectSocket();
            }
        };
    }, [socket]);

    return (
        <DeliveryContext.Provider value={{
            ...state,
            initializeDriver,
            updateLocation,
            acceptOrder,
            completeDelivery,
            refreshData,
            getDelivery,
            fetchDeliveryHistory,
            fetchAnalyticsData
        }}>
            {children}
        </DeliveryContext.Provider>
    );
};

export const useDelivery = (): IDeliveryContext => {
    const context = useContext(DeliveryContext);
    if (!context) {
        throw new Error('useDelivery must be used within a DeliveryProvider');
    }
    return context;
};