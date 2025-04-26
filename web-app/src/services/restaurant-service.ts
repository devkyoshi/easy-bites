import { api } from '@/config/axios.ts'
import {
  AddFoodItemRequest,
  AdminRestaurantResult,
  IRestaurantDetails,
} from '@/services/types/restaurant.type.ts'

export const getRestaurantDetailsByRestaurant = async (
  restaurantId: number
) => {
  try {
    const response = await api.get(`/api/restaurants/${restaurantId}`)
    return response.data.result as IRestaurantDetails
  } catch (e) {
    console.log(e)
  }
}

export const getRestaurantAdminDetails = async (adminId: number) => {
  try {
    const response = await api.get(
      `/api/restaurants/admin-restaurants/${adminId}`
    )
    return response.data.result as AdminRestaurantResult
  } catch (e) {
    console.log(e)
  }
}

export const addFoodItem = async (
  restaurantId: number,
  foodItem: AddFoodItemRequest
) => {
  try {
    const response = await api.post(
      `/api/restaurants/${restaurantId}/food-items`,
      foodItem
    )

    return response.data
  } catch (e) {
    console.log(e)
  }
}
