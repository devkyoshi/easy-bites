import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket, disconnectSocket } from "@/services/socket-service";
import { api } from "@/config/axios";
import {
    IDriverResponse,
    ILocation,
    IOrder,
    IDeliveryResponse,
    IDeliveryAcceptanceRequest,
    IRatingDistributionResponse,
    IWeeklyStatsResponse, IDeliveryAnalytics
} from "@/services/types/delivery.type";
import Socket = SocketIOClient.Socket;
import {fetchDeliveryAnalytics} from "@/services/delivery-service.ts";
import axios from "axios";

interface IDeliveryContext {
    deliveries: IDeliveryResponse[];
    driver: IDriverResponse | null;
    currentLocation: ILocation | null;
    nearbyOrders: IOrder[];
    activeDelivery: IDeliveryResponse | null;
    analytics: {
        weeklyStats: IWeeklyStatsResponse[];
        ratingDistribution: IRatingDistributionResponse[];
        averageRating: number;
    } | null;
    fetchNearbyOrders: (driverId: number, lat: number, lng: number) => Promise<IOrder[]>;
    loading: boolean;
    error: string | null;
    socketConnected: boolean;
    socketCleanup?: () => void;
    initializeDriver: (driverId: number, initialLocation?: ILocation, options?: { signal?: AbortSignal }) => Promise<void>;
    updateLocation: (lat: number, lng: number) => Promise<void>;
    refreshDriverLocation: (driverId: number) => Promise<ILocation | null>;
    acceptOrder: (request: IDeliveryAcceptanceRequest) => Promise<IDeliveryResponse | null>;
    completeDelivery: (
        id: number,
        data: { isCompleted: boolean; notes?: string; proofImage?: string }
    ) => Promise<IDeliveryResponse>;    refreshData: () => Promise<void>;
    deliveryHistory: IDeliveryResponse[];
    getDelivery: (id: number) => IDeliveryResponse | undefined;
    fetchDeliveryHistory: (driverId: number, options?: { signal?: AbortSignal }) => Promise<void>;
    fetchAnalyticsData: (driverId: number, options?: { signal?: AbortSignal }) => Promise<IDeliveryAnalytics>;
}

interface IApiResponse<T> {
    message: string;
    success: boolean;
    result: T;
}

const DeliveryContext = createContext<IDeliveryContext | undefined>(undefined);

export const DeliveryProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [state, setState] = useState<Omit<IDeliveryContext,
        'initializeDriver' | 'updateLocation' | 'acceptOrder' | 'completeDelivery' | 'refreshData' |
        'getDelivery' | 'fetchDeliveryHistory' | 'fetchAnalyticsData' | 'fetchNearbyOrders' | 'refreshDriverLocation'
    >>({
        driver: null,
        currentLocation: null,
        nearbyOrders: [],
        activeDelivery: null,
        deliveryHistory: [],
        analytics: null,
        loading: true,
        error: null,
        socketConnected: false,
        socketCleanup: undefined,
        deliveries: []
    });

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setState(prev => ({
                        ...prev,
                        currentLocation: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: position.timestamp
                        }
                    }));
                },
                (error) => console.error('Geolocation error:', error),
                { enableHighAccuracy: true, maximumAge: 10000 }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    useEffect(() => {
        if (!state.activeDelivery?.driverId || !state.currentLocation?.lat || !state.currentLocation?.lng) {
            return;
        }

        const interval = setInterval(async () => {
            try {
                await api.put(`/drivers/${state.activeDelivery!.driverId}/location`, {
                    lat: state.currentLocation!.lat,
                    lng: state.currentLocation!.lng
                });
            } catch (error) {
                console.error('Failed to update location:', error);
            }
        }, 15000);

        return () => clearInterval(interval);
    }, [state.activeDelivery?.driverId, state.currentLocation?.lat, state.currentLocation?.lng]);

    const refreshDriverLocation = async (driverId: number): Promise<ILocation> => {
        try {
            const response = await api.get<IApiResponse<IDriverResponse>>(`/drivers/${driverId}`);
            if (!response.data.result.currentLat || !response.data.result.currentLng) {
                throw new Error('Driver location not available');
            }
            return {
                lat: Number(response.data.result.currentLat),
                lng: Number(response.data.result.currentLng),
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Failed to fetch driver location:', error);
            throw error; // Re-throw to let calling code handle it
        }
    };


    const fetchDriver = async (driverId: number, options?: { signal?: AbortSignal }) => {
        try {
            const response = await api.get(`/api/delivery/drivers/${driverId}`, {
                signal: options?.signal
            });
            return response.data.result;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
                throw error;
            }
            console.error("Failed to fetch driver:", error);
            throw new Error("Failed to load driver profile");
        }
    };

    const fetchNearbyOrders = async (driverId: number, lat: number, lng: number): Promise<IOrder[]> => {
        try {
            const response = await api.get(`/api/delivery/orders/nearby`, {  // Changed to proper endpoint format
                params: { driverId, lat, lng },
            });
            return response.data.result;
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
            return response.data.result;
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

    const updateLocation = async (lat: number, lng: number) => {
        if (!state.driver) return;

        const location = { lat, lng, timestamp: Date.now() };

        try {
            await api.put(`/api/delivery/drivers/${state.driver.driverId}/location`, {
                lat,
                lng
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
                lat,
                lng
            );
            setState(prev => ({ ...prev, nearbyOrders }));
        } catch (error) {
            console.error('Location update failed:', error);
            throw error;
        }
    };

    const initializeDriver = async (
        driverId: number,
        initialLocation?: ILocation,
        options?: { signal?: AbortSignal }
    ): Promise<void> => {
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

                // Store cleanup function in state
                setState(prev => ({
                    ...prev,
                    socketCleanup: () => {
                        sock.off('connect', handleConnect);
                        sock.off('disconnect', handleDisconnect);
                        sock.off('newOrder', handleNewOrder);
                        sock.off('orderAccepted', handleOrderAccepted);
                        sock.off('orderCompleted', handleOrderCompleted);
                    }
                }));

                await new Promise<void>((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Socket connection timeout'));
                    }, 5000);

                    const onConnect = () => {
                        clearTimeout(timeout);
                        resolve();
                    };

                    sock.on('connect', onConnect);
                    sock.on('connect_error', reject);
                });
            }

            const [driver, activeDelivery] = await Promise.all([
                fetchDriver(driverId, options).catch(error => {
                    console.error("Failed to fetch driver:", error);
                    throw new Error("Failed to load driver information");
                }),
                fetchActiveDelivery(driverId, options).catch(error => {
                    console.error("Failed to fetch active delivery:", error);
                    return null;
                }),
            ]);

            const nearbyOrders = initialLocation
                ? await fetchNearbyOrders(driverId, initialLocation.lat, initialLocation.lng).catch(error => {
                    console.error("Failed to fetch nearby orders:", error);
                    return [];
                })
                : [];

            setState(prev => ({
                ...prev,
                driver,
                currentLocation: initialLocation || null,
                activeDelivery,
                nearbyOrders,
                loading: false,
                error: null
            }));
        } catch (error) {
            if (!options?.signal?.aborted) {
                const errorMessage = error instanceof Error ? error.message : "Failed to initialize driver data";
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: errorMessage
                }));
            } else {
                console.log("Initialization canceled:", error);
            }
            // Don't rethrow aborted errors
            if (!axios.isCancel(error)) {
                throw error;
            }
        }
    };

    const fetchDeliveryHistory = async (driverId: number, options?: { signal?: AbortSignal }) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await api.get(`/api/delivery/delivery/history`, {
                params: { driverId },
                signal: options?.signal
            });

            // Only update state if not aborted
            if (!options?.signal?.aborted) {
                setState(prev => ({
                    ...prev,
                    deliveryHistory: response.data.result,
                    loading: false,
                    error: null  // Explicitly clear error on success
                }));
            }
        } catch (error) {
            // Don't set error state for aborted requests
            if (axios.isCancel(error)) {
                console.log("Request was canceled:", error.message);
                return;
            }

            console.error("Failed to fetch delivery history", error);
            if (!options?.signal?.aborted) {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: "Failed to load delivery history"
                }));
            }
        }
    };

    const getDelivery = (deliveryId: number): IDeliveryResponse | undefined => {
        return state.deliveryHistory.find(d => d.driverId === deliveryId) || undefined;
    };

    const acceptOrder = async (request: IDeliveryAcceptanceRequest) => {
        if (!state.driver || !state.currentLocation) return null;

        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await api.post<IApiResponse<IDeliveryResponse>>(
                `/api/delivery/orders/accept/?driverId=${state.driver.driverId}`,
                {
                    ...request,
                    currentLat: state.currentLocation.lat,
                    currentLng: state.currentLocation.lng
                },
            );

            const delivery = response.data.result;
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

    const completeDelivery = async (
        id: number,
        data: { isCompleted: boolean; notes?: string; proofImage?: string }
    ): Promise<IDeliveryResponse> => {  // Now returns the delivery response
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await api.post<IApiResponse<IDeliveryResponse>>(
                `/api/delivery/delivery/complete`,
                {
                    ...data,
                    notes: data.notes || '', // Default empty string if undefined
                },
                { params: { deliveryId: id } }
            );

            const delivery = response.data.result;

            setState(prev => ({
                ...prev,
                activeDelivery: null,
                loading: false,
                driver: prev.driver ? { ...prev.driver, isAvailable: true } : null
            }));

            if (state.driver) {
                const analytics = await fetchAnalytics(state.driver.driverId);
                setState(prev => ({ ...prev, analytics }));
            }

            return delivery; // Return the completed delivery
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
                state.socketCleanup?.();
            }
        };
    }, [socket]);

    return (
        <DeliveryContext.Provider value={{
            ...state,
            deliveries: state.deliveries,
            currentLocation: state.currentLocation,
            fetchNearbyOrders,
            initializeDriver,
            updateLocation,
            acceptOrder,
            completeDelivery,
            refreshData,
            getDelivery,
            fetchDeliveryHistory,
            fetchAnalyticsData,
            refreshDriverLocation,
            activeDelivery: state.activeDelivery,
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