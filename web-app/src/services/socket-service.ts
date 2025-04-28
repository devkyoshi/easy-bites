// socket-service.ts
import io from "socket.io-client";
import type { IDeliveryResponse, IOrder } from "@/services/types/delivery.type";
import { toast } from "sonner";

// Use environment variable with proper fallback
const SOCKET_URL = import.meta.env.VITE_PUBLIC_SOCKET_URL || 'http://localhost:8084';

// Global socket instance
let socket: SocketIOClient.Socket | null = null;

/**
 * Initialize a new socket connection with proper error handling
 */
export const initializeSocket = (driverId: number): SocketIOClient.Socket => {
    if (socket?.connected) return socket;

    if (!driverId) {
        throw new Error("Driver ID is required for socket connection");
    }

    if (!SOCKET_URL) {
        throw new Error("Socket server URL is not configured");
    }

    if (socket) disconnectSocket();

    socket = io(SOCKET_URL, {
        path: '/socket.io',
        query: { driverId: driverId.toString() },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: true,
        forceNew: true,
    });

    socket.on('connect', () => {
        console.log('Socket connected with ID:', socket?.id);
        toast.success('Connected to real-time service');
    });

    socket.on('disconnect', (reason: string) => {
        console.warn('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
            setTimeout(() => socket?.connect(), 1000);
        }
    });

    socket.on('connect_error', (err: Error) => {
        console.error('Socket connection error:', err.message);
        toast.error(`Connection error: ${err.message}`);

        setTimeout(() => {
            if (socket && !socket.connected) {
                socket.io.opts.transports = ['polling'];
                socket.connect();
            }
        }, 2000);
    });

    socket.on('error', (err: Error) => {
        console.error('Socket error:', err);
        toast.error('Real-time service error');
    });

    return socket;
};

/**
 * Get active socket instance with safety checks
 */
export const getSocket = (): SocketIOClient.Socket => {
    if (!socket) throw new Error('Socket not initialized. Call initializeSocket first.');
    return socket;
};

/**
 * Properly disconnect and cleanup socket
 */
export const disconnectSocket = (): void => {
    if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('error');

        if (socket.connected) {
            socket.disconnect();
        }

        socket = null;
        console.log('Socket disconnected and cleaned up');
    }
};

// Type definitions for Socket events
export interface SocketEvents {
    'locationUpdated': (location: { lat: number; lng: number }) => void;
    'newOrder': (order: IOrder) => void;
    'orderAccepted': (delivery: IDeliveryResponse) => void;
    'orderCompleted': (deliveryId: number) => void;
    'driverStatusChanged': (status: { isAvailable: boolean }) => void;
}
