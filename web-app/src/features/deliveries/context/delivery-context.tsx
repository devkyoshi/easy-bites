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
    currentLocation : ILocation | null;
    driver: IDriverResponse | null;
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
    ) => Promise<IDeliveryResponse>;
    refreshData: () => Promise<void>;
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

    const [currentLocation, setCurrentLocation] = useState<ILocation | null>(null);

    const [socket, setSocket] = useState<Socket | null>(null);

// delivery-context.tsx (or wherever your useEffect lives)
    useEffect(() => {
        let watchId: number | null = null

        if (!navigator.geolocation) {
            setState(prev => ({ ...prev, error: 'Geolocation not supported' }))
            return
        }

        navigator.permissions
            .query({ name: 'geolocation' })
            .then(permissionStatus => {
                console.log('Geolocation permission state:', permissionStatus.state)

                // start watching only once permission is known
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const coords = position.coords
                        setState(prev => ({
                            ...prev, // ← flip your flag
                            currentLocationData: {               // ← fill in exactly what NearbyDeliveries expects
                                lat: coords.latitude,
                                lng: coords.longitude,
                                accuracy: coords.accuracy,
                                timestamp: position.timestamp
                            }
                        }))

                        setCurrentLocation({
                            lat: coords.latitude,
                            lng: coords.longitude,
                            accuracy: coords.accuracy,
                            timestamp: position.timestamp
                        })
                    },
                    (error) => {
                        console.error('Geolocation error:', error)
                        if (error.code === error.PERMISSION_DENIED) {
                            setState(prev => ({ ...prev, error: 'Location permission denied' }))
                        }
                    },
                    { enableHighAccuracy: true, maximumAge: 10_000 }
                )

                console.log('watchId', watchId)
            })

        return () => {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId)
        }
    }, [])

    useEffect(() => {
        if (!state.activeDelivery?.driverId || !currentLocation?.lat || !currentLocation?.lng) {
            return;
        }

        const interval = setInterval(async () => {
            try {
                await api.put(`/drivers/${state.activeDelivery!.driverId}/location`, {
                    lat: currentLocation!.lat,
                    lng: currentLocation!.lng
                });
            } catch (error) {
                console.error('Failed to update location:', error);
            }
        }, 15000);

        return () => clearInterval(interval);
    }, [state.activeDelivery?.driverId, currentLocation?.lat, currentLocation?.lng]);

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
            setState(prev => ({
                ...prev,
                nearbyOrders: response.data.result
            }));
            return response.data.result;
        } catch (error) {
            console.error("Failed to fetch nearby orders", error);
            setState(prev => ({
                ...prev,
                nearbyOrders: [] // Clear nearby orders on error
            }));
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
            await api.put(`/api/delivery/drivers/${state.driver.driverID}/location`, {
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
                state.driver.driverID,
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
        if (state.loading && state.driver) return;

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            if (options?.signal?.aborted) {
                console.log("Initialization aborted before start");
                return;
            }

            const [driver, activeDelivery] = await Promise.all([
                fetchDriver(driverId, options).catch(error => {
                    if (error.name !== 'CanceledError') {
                        console.error("Failed to fetch driver:", error);
                        throw new Error("Failed to load driver information");
                    }
                    return null;
                }),
                fetchActiveDelivery(driverId, options).catch(error => {
                    if (error.name !== 'CanceledError') {
                        console.error("Failed to fetch active delivery:", error);
                    }
                    return null;
                }),
            ]);

            if (options?.signal?.aborted) {
                console.log("Initialization aborted during requests");
                return;
            }

            setState(prev => ({
                ...prev,
                driver,
                loading: false,
                error: null,
                activeDelivery: activeDelivery || null
            }));

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

            const nearbyOrders = initialLocation
                ? await fetchNearbyOrders(driverId, initialLocation.lat, initialLocation.lng).catch(error => {
                    console.error("Failed to fetch nearby orders:", error);
                    return [];
                })
                : [];
            console.log("nearby orders", nearbyOrders);

            setState(prev => ({
                ...prev,
                currentLocation: initialLocation || null,
                activeDelivery,
                nearbyOrders,
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
        return state.deliveryHistory.find(d => d.deliveryId === deliveryId) || undefined;
    };

    const acceptOrder = async (request: IDeliveryAcceptanceRequest) => {
        console.log('acceptOrder called with request:', request);
        if (!state.driver || !currentLocation) {
            console.warn('Cannot accept order: driver or location not available', {
                driver: state.driver,
                location: currentLocation
            });
            return null;
        }

        setState(prev => ({ ...prev, loading: true }));
        try {
            console.log('Making API call to accept order');
            const response = await api.post<IApiResponse<IDeliveryResponse>>(
                `/api/delivery/orders/accept/${state.driver.driverID}`,
                {
                    ...request,
                    currentLat: currentLocation.lat,
                    currentLng: currentLocation.lng
                },
            );

            console.log('API response:', response);
            const delivery = response.data.result;

            setState(prev => ({
                ...prev,
                activeDelivery: delivery,
                nearbyOrders: prev.nearbyOrders.filter(o => o.id !== delivery.orderId),
                loading: false
            }));

            console.log('Order accepted, updated state');
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
                const analytics = await fetchAnalytics(state.driver.driverID);
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
        if (!state.driver || !currentLocation) return; // Check for null first

        const driverId = state.driver.driverID;
        console.log('refreshData', currentLocation);
        console.log('driverId', state.driver);

        setState(prev => ({ ...prev, loading: true }));
        try {
            const [activeDelivery, analytics, nearbyOrders] = await Promise.all([
                fetchActiveDelivery(driverId),
                fetchAnalytics(driverId),
                fetchNearbyOrders(
                    driverId,
                    currentLocation.lat, // Safe to access now
                    currentLocation.lng  // Safe to access now
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
            currentLocation,
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

// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { api } from "@/config/axios";
// import {
//     IDriverResponse,
//     ILocation,
//     IOrder,
//     IDeliveryResponse,
//     IDeliveryAcceptanceRequest,
//     IRatingDistributionResponse,
//     IWeeklyStatsResponse,
//     IDeliveryAnalytics
// } from "@/services/types/delivery.type";
// import { fetchDeliveryAnalytics } from "@/services/delivery-service.ts";
// import axios, { CancelTokenSource } from "axios";
// import { toast } from "sonner";
//
// interface IDeliveryContext {
//     deliveries: IDeliveryResponse[];
//     driver: IDriverResponse | null;
//     currentLocation: ILocation | null;
//     nearbyOrders: IOrder[];
//     activeDelivery: IDeliveryResponse | null;
//     analytics: {
//         weeklyStats: IWeeklyStatsResponse[];
//         ratingDistribution: IRatingDistributionResponse[];
//         averageRating: number;
//     } | null;
//     fetchNearbyOrders: (driverId: number, lat: number, lng: number) => Promise<IOrder[]>;
//     loading: boolean;
//     error: string | null;
//     initializeDriver: (driverId: number, initialLocation?: ILocation, options?: { signal?: AbortSignal }) => Promise<void>;
//     updateLocation: (lat: number, lng: number) => Promise<void>;
//     refreshDriverLocation: (driverId: number) => Promise<ILocation | null>;
//     acceptOrder: (request: IDeliveryAcceptanceRequest) => Promise<IDeliveryResponse | null>;
//     completeDelivery: (
//         id: number,
//         data: { isCompleted: boolean; notes?: string; proofImage?: string }
//     ) => Promise<IDeliveryResponse>;
//     refreshData: () => Promise<void>;
//     deliveryHistory: IDeliveryResponse[];
//     getDelivery: (id: number) => IDeliveryResponse | undefined;
//     fetchDeliveryHistory: (driverId: number, options?: { signal?: AbortSignal }) => Promise<void>;
//     fetchAnalyticsData: (driverId: number, options?: { signal?: AbortSignal }) => Promise<IDeliveryAnalytics>;
//     cleanupPolling: () => void;
// }
//
// interface IApiResponse<T> {
//     message: string;
//     success: boolean;
//     result: T;
// }
//
// const DeliveryContext = createContext<IDeliveryContext | undefined>(undefined);
//
// export const DeliveryProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
//     const [state, setState] = useState<Omit<IDeliveryContext,
//         'initializeDriver' | 'updateLocation' | 'acceptOrder' | 'completeDelivery' | 'refreshData' |
//         'getDelivery' | 'fetchDeliveryHistory' | 'fetchAnalyticsData' | 'fetchNearbyOrders' |
//         'refreshDriverLocation' | 'cleanupPolling'
//     >>({
//         driver: null,
//         currentLocation: null,
//         nearbyOrders: [],
//         activeDelivery: null,
//         deliveryHistory: [],
//         analytics: null,
//         loading: true,
//         error: null,
//         deliveries: []
//     });
//
//     const POLLING_INTERVAL = 10000; // 10 seconds
//     const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
//     const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource | null>(null);
//
//     // Cleanup all resources
//     const cleanup = useCallback(() => {
//         if (pollingInterval) {
//             clearInterval(pollingInterval);
//             setPollingInterval(null);
//         }
//         if (cancelTokenSource) {
//             cancelTokenSource.cancel("Component unmounted");
//         }
//     }, [pollingInterval, cancelTokenSource]);
//
//     // Initialize geolocation tracking
//     useEffect(() => {
//         if (!navigator.geolocation) {
//             console.error('Geolocation is not supported by this browser');
//             return;
//         }
//
//         const watchId = navigator.geolocation.watchPosition(
//             (position) => {
//                 setState(prev => ({
//                     ...prev,
//                     currentLocation: {
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude,
//                         accuracy: position.coords.accuracy,
//                         timestamp: position.timestamp
//                     }
//                 }));
//             },
//             (error) => {
//                 console.error('Geolocation error:', error);
//                 setState(prev => ({
//                     ...prev,
//                     error: 'Failed to get current location'
//                 }));
//             },
//             { enableHighAccuracy: true, maximumAge: 10000 }
//         );
//
//         return () => navigator.geolocation.clearWatch(watchId);
//     }, []);
//
//     // Update driver location periodically when there's an active delivery
//     useEffect(() => {
//         if (!state.activeDelivery?.driverId || !state.currentLocation?.lat || !state.currentLocation?.lng) {
//             return;
//         }
//
//         const interval = setInterval(async () => {
//             try {
//                 await api.put(`/drivers/${state.activeDelivery!.driverId}/location`, {
//                     lat: state.currentLocation!.lat,
//                     lng: state.currentLocation!.lng
//                 });
//             } catch (error) {
//                 if (!axios.isCancel(error)) {
//                     console.error('Failed to update location:', error);
//                 }
//             }
//         }, 15000);
//
//         return () => clearInterval(interval);
//     }, [state.activeDelivery?.driverId, state.currentLocation?.lat, state.currentLocation?.lng]);
//
//     const refreshDriverLocation = async (driverId: number): Promise<ILocation> => {
//         try {
//             const source = axios.CancelToken.source();
//             setCancelTokenSource(source);
//
//             const response = await api.get<IApiResponse<IDriverResponse>>(`/drivers/${driverId}`, {
//                 cancelToken: source.token
//             });
//
//             if (!response.data.result.currentLat || !response.data.result.currentLng) {
//                 throw new Error('Driver location not available');
//             }
//
//             return {
//                 lat: Number(response.data.result.currentLat),
//                 lng: Number(response.data.result.currentLng),
//                 timestamp: Date.now()
//             };
//         } catch (error) {
//             if (axios.isCancel(error)) {
//                 throw new Error('Location request canceled');
//             }
//             console.error('Failed to fetch driver location:', error);
//             throw error;
//         }
//     };
//
//     const fetchDriver = async (driverId: number, options?: { signal?: AbortSignal }) => {
//         try {
//             const response = await api.get(`/api/delivery/drivers/${driverId}`, {
//                 signal: options?.signal
//             });
//             return response.data.result;
//         } catch (error) {
//             if (axios.isCancel(error)) {
//                 console.log('Request canceled:', error.message);
//                 throw error;
//             }
//             console.error("Failed to fetch driver:", error);
//             throw new Error("Failed to load driver profile");
//         }
//     };
//
//     const fetchNearbyOrders = async (driverId: number, lat: number, lng: number): Promise<IOrder[]> => {
//         try {
//             const source = axios.CancelToken.source();
//             setCancelTokenSource(source);
//
//             const response = await api.get(`/api/delivery/orders/nearby`, {
//                 params: { driverId, lat, lng },
//                 cancelToken: source.token
//             });
//
//             setState(prev => ({
//                 ...prev,
//                 nearbyOrders: response.data.result
//             }));
//
//             return response.data.result;
//         } catch (error) {
//             if (axios.isCancel(error)) {
//                 return [];
//             }
//             console.error("Failed to fetch nearby orders", error);
//             setState(prev => ({
//                 ...prev,
//                 nearbyOrders: []
//             }));
//             return [];
//         }
//     };
//
//     const fetchActiveDelivery = async (driverId: number, options?: { signal?: AbortSignal }): Promise<IDeliveryResponse | null> => {
//         try {
//             const response = await api.get(`/api/delivery/delivery/active`, {
//                 params: { driverId },
//                 signal: options?.signal
//             });
//             return response.data.result;
//         } catch (error) {
//             if (axios.isCancel(error)) {
//                 console.log('Request canceled:', error.message);
//                 throw error;
//             }
//             if (axios.isAxiosError(error) && error.response?.status === 404) {
//                 return null;
//             }
//             console.error("Failed to fetch active delivery", error);
//             throw error;
//         }
//     };
//
//     const fetchAnalytics = async (driverId: number, options?: { signal?: AbortSignal }) => {
//         try {
//             return await fetchDeliveryAnalytics(driverId);
//         } catch (error) {
//             if (axios.isCancel(error)) {
//                 console.log('Analytics fetch canceled:', error.message);
//                 throw error;
//             }
//             console.error("Failed to fetch analytics", error);
//             throw error;
//         }
//     };
//
//     const updateLocation = async (lat: number, lng: number) => {
//         if (!state.driver) return;
//
//         const location = { lat, lng, timestamp: Date.now() };
//
//         try {
//             await api.put(`/api/delivery/drivers/${state.driver.driverId}/location`, {
//                 lat,
//                 lng
//             });
//
//             setState(prev => ({
//                 ...prev,
//                 currentLocation: location
//             }));
//
//             const nearbyOrders = await fetchNearbyOrders(
//                 state.driver.driverId,
//                 lat,
//                 lng
//             );
//             setState(prev => ({ ...prev, nearbyOrders }));
//         } catch (error) {
//             if (!axios.isCancel(error)) {
//                 console.error('Location update failed:', error);
//                 throw error;
//             }
//         }
//     };
//
//     const startPolling = useCallback((driverId: number, initialLocation?: ILocation) => {
//         // Clear any existing polling
//         if (pollingInterval) {
//             clearInterval(pollingInterval);
//         }
//
//         // Immediate first poll
//         pollForUpdates(driverId, initialLocation);
//
//         // Set up regular polling
//         const interval = setInterval(() => {
//             pollForUpdates(driverId, initialLocation);
//         }, POLLING_INTERVAL);
//
//         setPollingInterval(interval);
//     }, [pollingInterval]);
//
//     const stopPolling = useCallback(() => {
//         if (pollingInterval) {
//             clearInterval(pollingInterval);
//             setPollingInterval(null);
//         }
//     }, [pollingInterval]);
//
//     const pollForUpdates = async (driverId: number, initialLocation?: ILocation) => {
//         const abortController = new AbortController();
//
//         try {
//             const [activeDelivery, nearbyOrders] = await Promise.all([
//                 fetchActiveDelivery(driverId, { signal: abortController.signal }).catch(() => null),
//                 initialLocation
//                     ? fetchNearbyOrders(driverId, initialLocation.lat, initialLocation.lng)
//                     : Promise.resolve([])
//             ]);
//
//             setState(prev => {
//                 // Detect orders accepted by others
//                 const removedOrderIds = prev.nearbyOrders
//                     .filter(prevOrder => !nearbyOrders.some(newOrder => newOrder.id === prevOrder.id))
//                     .map(order => order.id);
//
//                 // Detect new orders
//                 const newOrders = nearbyOrders.filter(newOrder =>
//                     !prev.nearbyOrders.some(prevOrder => prevOrder.id === newOrder.id)
//                 );
//
//                 // Notifications
//                 if (newOrders.length > 0) {
//                     newOrders.forEach(order => {
//                         const restaurantName = order.items[0]?.restaurantName || 'a restaurant';
//                         toast.info(`New order available from ${restaurantName}`);
//                     });
//                 }
//
//                 if (removedOrderIds.length > 0 && prev.nearbyOrders.length > 0) {
//                     toast.warning(`${removedOrderIds.length} order(s) taken by other drivers`);
//                 }
//
//                 const updatedActiveDelivery = activeDelivery ?? prev.activeDelivery;
//                 const updatedDriver = prev.driver ? {
//                     ...prev.driver,
//                     isAvailable: updatedActiveDelivery === null
//                 } : null;
//
//                 return {
//                     ...prev,
//                     activeDelivery: updatedActiveDelivery,
//                     nearbyOrders,
//                     driver: updatedDriver
//                 };
//             });
//         } catch (error) {
//             if (!axios.isCancel(error)) {
//                 console.error("Polling error:", error);
//             }
//         } finally {
//             abortController.abort();
//         }
//     };
//
//     const initializeDriver = async (
//         driverId: number,
//         initialLocation?: ILocation,
//         options?: { signal?: AbortSignal }
//     ): Promise<void> => {
//         if (state.loading && state.driver) return;
//
//         setState(prev => ({ ...prev, loading: true, error: null }));
//
//         try {
//             const [driver, activeDelivery] = await Promise.all([
//                 fetchDriver(driverId, options),
//                 fetchActiveDelivery(driverId, options).catch(() => null)
//             ]);
//
//             setState(prev => ({
//                 ...prev,
//                 driver,
//                 activeDelivery,
//                 loading: false,
//                 error: null
//             }));
//
//             // Start polling for updates
//             startPolling(driverId, initialLocation);
//
//             // Fetch nearby orders
//             const nearbyOrders = initialLocation
//                 ? await fetchNearbyOrders(driverId, initialLocation.lat, initialLocation.lng)
//                 : [];
//
//             setState(prev => ({
//                 ...prev,
//                 currentLocation: initialLocation || prev.currentLocation,
//                 nearbyOrders
//             }));
//         } catch (error) {
//             if (!options?.signal?.aborted) {
//                 const errorMessage = error instanceof Error ? error.message : "Failed to initialize driver data";
//                 setState(prev => ({
//                     ...prev,
//                     loading: false,
//                     error: errorMessage
//                 }));
//             }
//         }
//     };
//
//     const fetchDeliveryHistory = async (driverId: number, options?: { signal?: AbortSignal }) => {
//         setState(prev => ({ ...prev, loading: true }));
//         try {
//             const response = await api.get(`/api/delivery/delivery/history`, {
//                 params: { driverId },
//                 signal: options?.signal
//             });
//
//             if (!options?.signal?.aborted) {
//                 setState(prev => ({
//                     ...prev,
//                     deliveryHistory: response.data.result,
//                     loading: false,
//                     error: null
//                 }));
//             }
//         } catch (error) {
//             if (!axios.isCancel(error) && !options?.signal?.aborted) {
//                 console.error("Failed to fetch delivery history", error);
//                 setState(prev => ({
//                     ...prev,
//                     loading: false,
//                     error: "Failed to load delivery history"
//                 }));
//             }
//         }
//     };
//
//     const getDelivery = (deliveryId: number): IDeliveryResponse | undefined => {
//         return state.deliveryHistory.find(d => d.id === deliveryId);
//     };
//
//     const acceptOrder = async (request: IDeliveryAcceptanceRequest) => {
//         if (!state.driver || !state.currentLocation) {
//             console.warn('Cannot accept order: driver or location not available');
//             return null;
//         }
//
//         setState(prev => ({ ...prev, loading: true }));
//         try {
//             const response = await api.post<IApiResponse<IDeliveryResponse>>(
//                 `/api/delivery/orders/accept`,
//                 {
//                     ...request,
//                     currentLat: state.currentLocation.lat,
//                     currentLng: state.currentLocation.lng
//                 },
//                 { params: { driverId: state.driver.driverId } }
//             );
//
//             const delivery = response.data.result;
//             setState(prev => ({
//                 ...prev,
//                 activeDelivery: delivery,
//                 nearbyOrders: prev.nearbyOrders.filter(o => o.id !== delivery.orderId),
//                 loading: false
//             }));
//
//             return delivery;
//         } catch (error) {
//             console.error("Failed to accept order", error);
//             setState(prev => ({ ...prev, loading: false }));
//             throw error;
//         }
//     };
//
//     const completeDelivery = async (
//         id: number,
//         data: { isCompleted: boolean; notes?: string; proofImage?: string }
//     ): Promise<IDeliveryResponse> => {
//         setState(prev => ({ ...prev, loading: true }));
//         try {
//             const response = await api.post<IApiResponse<IDeliveryResponse>>(
//                 `/api/delivery/delivery/complete`,
//                 data,
//                 { params: { deliveryId: id } }
//             );
//
//             const delivery = response.data.result;
//             setState(prev => ({
//                 ...prev,
//                 activeDelivery: null,
//                 loading: false,
//                 driver: prev.driver ? { ...prev.driver, isAvailable: true } : null
//             }));
//
//             if (state.driver) {
//                 const analytics = await fetchAnalytics(state.driver.driverId);
//                 setState(prev => ({ ...prev, analytics }));
//             }
//
//             return delivery;
//         } catch (error) {
//             console.error("Failed to complete delivery", error);
//             setState(prev => ({ ...prev, loading: false }));
//             throw error;
//         }
//     };
//
//     const fetchAnalyticsData = async (driverId: number, options?: { signal?: AbortSignal }) => {
//         setState(prev => ({ ...prev, loading: true }));
//         try {
//             const analytics = await fetchAnalytics(driverId, options);
//             setState(prev => ({
//                 ...prev,
//                 analytics,
//                 loading: false,
//                 error: null
//             }));
//             return analytics;
//         } catch (error) {
//             if (!axios.isCancel(error) && !options?.signal?.aborted) {
//                 console.error("Failed to fetch analytics", error);
//                 setState(prev => ({
//                     ...prev,
//                     loading: false,
//                     error: "Failed to load analytics"
//                 }));
//             }
//             throw error;
//         }
//     };
//
//     const refreshData = async (options?: { signal?: AbortSignal }) => {
//         if (!state.driver || !state.currentLocation) return;
//
//         setState(prev => ({ ...prev, loading: true }));
//         try {
//             const [activeDelivery, analytics, nearbyOrders] = await Promise.all([
//                 fetchActiveDelivery(state.driver.driverId, options),
//                 fetchAnalytics(state.driver.driverId, options),
//                 fetchNearbyOrders(
//                     state.driver.driverId,
//                     state.currentLocation.lat,
//                     state.currentLocation.lng
//                 )
//             ]);
//
//             setState(prev => ({
//                 ...prev,
//                 activeDelivery,
//                 analytics,
//                 nearbyOrders,
//                 loading: false
//             }));
//         } catch (error) {
//             console.error("Failed to refresh data", error);
//             setState(prev => ({ ...prev, loading: false }));
//             throw error;
//         }
//     };
//
//     // Cleanup on unmount
//     useEffect(() => {
//         return () => {
//             cleanup();
//         };
//     }, [cleanup]);
//
//     return (
//         <DeliveryContext.Provider value={{
//             ...state,
//             fetchNearbyOrders,
//             initializeDriver,
//             updateLocation,
//             acceptOrder,
//             completeDelivery,
//             refreshData,
//             getDelivery,
//             fetchDeliveryHistory,
//             fetchAnalyticsData,
//             refreshDriverLocation,
//             cleanupPolling: cleanup
//         }}>
//             {children}
//         </DeliveryContext.Provider>
//     );
// };
//
// export const useDelivery = (): IDeliveryContext => {
//     const context = useContext(DeliveryContext);
//     if (!context) {
//         throw new Error('useDelivery must be used within a DeliveryProvider');
//     }
//     return context;
// };