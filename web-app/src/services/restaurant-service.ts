import {api} from "@/config/axios.ts";
import {IRestaurantDetails} from "@/services/types/restaurant.type.ts";

export const getRestaurantDetailsByRestaurant = async (restaurantId: number) => {
    try {
        const response = await api.get(`/api/restaurants/${restaurantId}`);
        return response.data.result as IRestaurantDetails;
    } catch (e) {
        console.log(e);
    }
}