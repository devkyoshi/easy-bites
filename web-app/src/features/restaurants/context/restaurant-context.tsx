import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/config/axios.ts";

type RestaurantDialogType = 'create' | 'update' | 'delete';

export interface IRestaurant {
    restaurantId: string;
    name: string;
    description: string;
    logoUrl: string;
    isOpen: boolean;
}

interface RestaurantContextType {
    open: RestaurantDialogType | null;
    restaurants: IRestaurant[];
    loading: boolean;
    error: string | null;
    fetchRestaurants: () => Promise<void>;
    setOpen: (str: RestaurantDialogType | null) => void;
    currentRow: IRestaurant | null;
    setCurrentRow: React.Dispatch<React.SetStateAction<IRestaurant | null>>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<RestaurantDialogType | null>(null);
    const [currentRow, setCurrentRow] = useState<IRestaurant | null>(null);

    // Use useCallback to memoize the function
    const fetchRestaurants = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/restaurants/all');
            setRestaurants(response.data.result);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch restaurants');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                await fetchRestaurants();
            } catch (err) {
                if (isMounted) setError('Failed to load restaurants');
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cleanup for Strict Mode
        };
    }, [fetchRestaurants]);

    return (
        <RestaurantContext.Provider
            value={{
                restaurants,
                loading,
                error,
                fetchRestaurants,
                setOpen,
                open,
                currentRow,
                setCurrentRow
            }}
        >
            {children}
        </RestaurantContext.Provider>
    );
};

export const useRestaurant = () => {
    const context = useContext(RestaurantContext);
    if (!context) {
        throw new Error('useRestaurant must be used within a RestaurantProvider');
    }
    return context;
}