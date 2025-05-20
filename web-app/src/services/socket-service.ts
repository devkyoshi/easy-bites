import io from "socket.io-client";
import type { IDeliveryResponse, IOrder } from "@/services/types/delivery.type";
import { toast } from "sonner";

const SOCKET_URL = import.meta.env.VITE_PUBLIC_SOCKET_URL || 'http://localhost:8085';

let socket: SocketIOClient.Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const initializeSocket = (driverId: number): SocketIOClient.Socket => {
    if (socket?.connected) return socket;

    if (!driverId) throw new Error("Driver ID is required");
    if (!SOCKET_URL) throw new Error("Socket server URL not configured");

    if (socket) disconnectSocket();

    const socketOptions: SocketIOClient.ConnectOpts = {
        path: '/socket.io',
        query: { driverId: driverId.toString() },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 200000,
        autoConnect: true,
        forceNew: true,
        secure: false, // Set to true if using HTTPS
        rejectUnauthorized: false // Only for development with self-signed certs
    };

    socket = io(SOCKET_URL, socketOptions);

    // Connection events
    socket.on('connect', () => {
        reconnectAttempts = 0;
        console.log('Socket connected:', socket?.id);
        toast.success('Realtime service connected');

        // Join driver-specific room
        socket?.emit('joinDriverRoom', driverId);
    });

    socket.on('disconnect', (reason: string) => {
        console.warn('Disconnected:', reason);
        if (reason === 'io server disconnect') {
            setTimeout(() => socket?.connect(), 3000);
        }
    });

    socket.on('connect_error', (err: Error) => {
        reconnectAttempts++;
        console.error('Connection error:', err.message);

        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            toast.error('Realtime connection failed - using fallback');
        } else {
            toast.warning(`Reconnecting... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        }
    });

    // Business events
    socket.on('newOrderAvailable', (order: IOrder) => {
        // Get the first restaurant from items (assuming all items are from same restaurant)
        const restaurantName = order.items[0]?.restaurantName || 'Unknown Restaurant';
        console.log('New order available from:', restaurantName);
        toast.info(`New order available from ${restaurantName}`);
    });

    socket.on('orderAccepted', (data: { driverId: number, orderId: number }) => {
        if (data.driverId !== driverId) {
            console.log(`Order ${data.orderId} taken by another driver`);
            toast.warning('Order taken by another driver');
        }
    });

    socket.on('locationUpdated', (location: { lat: number, lng: number }) => {
        console.log('Location updated:', location);
    });

    return socket;
};

// Helper function to calculate area hash based on restaurant location
// const getAreaHash = (lat: number, lng: number, precision: number = 2): string => {
//     // Simple implementation - rounds coordinates to 'precision' decimal places
//     // In production, use a proper geohashing algorithm
//     const roundedLat = lat.toFixed(precision);
//     const roundedLng = lng.toFixed(precision);
//     return `${roundedLat},${roundedLng}`;
// };

// Updated event interfaces
export interface SocketEvents {
    'newOrderAvailable': (order: IOrder) => void;
    'orderAccepted': (data: { driverId: number, orderId: number }) => void;
    'orderCompleted': (deliveryId: number) => void;
    'locationUpdated': (location: { lat: number, lng: number }) => void;
    'driverStatusChanged': (status: { isAvailable: boolean }) => void;
    'driverAssigned': (delivery: IDeliveryResponse) => void;
}

// Helper functions
export const emitLocationUpdate = (location: { lat: number, lng: number }) => {
    getSocket().emit('updateLocation', location);
};

export const emitOrderAccept = (orderId: number) => {
    getSocket().emit('acceptOrder', { orderId });
};

export const getSocket = (): SocketIOClient.Socket => {
    if (!socket) throw new Error('Socket not initialized');
    return socket;
};

export const disconnectSocket = (): void => {
    if (socket) {
        socket.removeAllListeners();
        if (socket.connected) {
            socket.disconnect();
        }
        socket = null;
        console.log('Socket disconnected');
    }
};