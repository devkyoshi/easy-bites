import React, {createContext, useContext, useState} from "react";
import {api} from "@/config/axios.ts";
import {IFoodItem, IMenuCategory} from "@/services/types/restaurant.type.ts";

interface FoodItemContextType {
    foodItems: IFoodItem[];
    categories: IMenuCategory[]
    loading: boolean;
    error: string | null;
    fetchFoodItems: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    currentRow: IFoodItem | null
    selectedRestaurantId: number | null
    setSelectedRestaurantId: React.Dispatch<React.SetStateAction<number | null>>
    setCurrentRow: React.Dispatch<React.SetStateAction<IFoodItem | null>>
}

const FoodItemContext = createContext<FoodItemContextType | undefined>(undefined);

export const FoodItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [foodItems, setFoodItems] = useState<IFoodItem[]>([]);
    const [categories, setCategories] = useState<IMenuCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentRow, setCurrentRow] = useState<IFoodItem | null>(null);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);

    const fetchFoodItems = async () => {
        setLoading(true);
        try {
            if(!selectedRestaurantId) return
            const response = await api.get(`/api/restaurants/${selectedRestaurantId}/food-items`);
            setFoodItems(response.data.result);
        } catch (err: any) {
            setError('Failed to fetch restaurants');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            if(!selectedRestaurantId) return
            const response = await api.get(`/api/restaurants/${selectedRestaurantId}/categories`);
            setCategories(response.data.result);
        } catch (err: any) {
            setError('Failed to fetch restaurants');
        } finally {
            setLoading(false);
        }
    };

    // Fetch fetchCategories when the component mounts
    React.useEffect(() => {
        fetchCategories().then();
    }, [selectedRestaurantId]);

    // Fetch fetchFoodItems when the component mounts
    React.useEffect(() => {
        fetchFoodItems().then();
    }, [selectedRestaurantId]);

    return (
        <FoodItemContext.Provider value={{ foodItems, loading, error, fetchFoodItems, fetchCategories, currentRow, setCurrentRow  , selectedRestaurantId, setSelectedRestaurantId, categories }}>
            {children}
        </FoodItemContext.Provider>
    );
};

export const useFoodItems = (): FoodItemContextType => {
    const context = useContext(FoodItemContext);
    if (!context) {
        throw new Error('useFoodItems must be used within a FoodItemProvider');
    }
    return context;
};