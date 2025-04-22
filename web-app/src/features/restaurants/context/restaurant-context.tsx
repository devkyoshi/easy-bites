import React, {createContext, useContext, useState} from "react";
import {api} from "@/config/axios.ts";

export interface IRestaurant {
    restaurantId: string;
    name: string;
    description: string;
    logoUrl : string;
    isOpen: boolean;
}

interface RestaurantContextType {
    restaurants: IRestaurant[];
    loading: boolean;
    error: string | null;
    fetchRestaurants: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/restaurants/all');


            setRestaurants(response.data.result);
        } catch (err: any) {
            setError('Failed to fetch restaurants');
        } finally {
            setLoading(false);
        }
    };


    // Fetch restaurants when the component mounts
    React.useEffect(() => {
        fetchRestaurants().then();
    }, []);

    return (
        <RestaurantContext.Provider value={{ restaurants, loading, error, fetchRestaurants }}>
            {children}
        </RestaurantContext.Provider>
    );
};

export const useRestaurant = (): RestaurantContextType => {
    const context = useContext(RestaurantContext);
    if (!context) {
        throw new Error('useRestaurantContext must be used within a RestaurantProvider');
    }
    return context;
};