import React, {createContext, useContext, useState} from "react";
import {api} from "@/config/axios.ts";
import {IFoodItem, IMenuCategory} from "@/services/types/restaurant.type.ts";

interface FoodItemContextType {
    foodItems: IFoodItem[];
    categories: IMenuCategory[]
    loading: boolean;
    error: string | null;
    fetchFoodItems: (restaurantId: number) => Promise<IFoodItem[]>;
    fetchCategories: (restaurantId: number) => Promise<IMenuCategory[]>;
    currentRow: IFoodItem | null
    setCurrentRow: React.Dispatch<React.SetStateAction<IFoodItem | null>>
}

const FoodItemContext = createContext<FoodItemContextType | undefined>(undefined);

export const FoodItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [foodItems, setFoodItems] = useState<IFoodItem[]>([]);
    const [categories, setCategories] = useState<IMenuCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentRow, setCurrentRow] = useState<IFoodItem | null>(null);



    const fetchFoodItems = async (restaurantId : number) => {
        setLoading(true);
        try {
            if(!restaurantId) return
            const response = await api.get(`/api/restaurants/${restaurantId}/food-items`);
            setFoodItems(response.data.result);
            console.log(response.data.result)

            return response.data.result
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Failed to fetch restaurants');
            return []
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async (restaurantId : number) => {
        setLoading(true);
        try {
            if(!restaurantId) return
            const response = await api.get(`/api/restaurants/${restaurantId}/categories`);
            setCategories(response.data.result);
            return response.data.result
        } catch (err) {
            setError('Failed to fetch restaurants');
            return []
        } finally {
            setLoading(false);
        }
    };


    return (
        <FoodItemContext.Provider value={{ foodItems, loading, error, currentRow, setCurrentRow , categories , fetchFoodItems, fetchCategories}}>
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