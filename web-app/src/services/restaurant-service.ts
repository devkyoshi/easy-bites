import { api } from '@/config/axios.ts'
import {
  AddFoodItemRequest,
  AdminRestaurantResult,
  IRestaurantDetails,
} from '@/services/types/restaurant.type.ts'
import { toast } from 'sonner'

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
    toast.error(
      (e as any).response.data.message ||
        'Error adding food item. Please try again later.',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
  }
}

export const updateFoodItem = async (
  restaurantId: number,
  foodItemId: number,
  foodItem: AddFoodItemRequest
) => {
  try {
    const response = await api.put(
      `/api/restaurants/${restaurantId}/food-items/${foodItemId}`,
      foodItem
    )
    return response.data
  } catch (e) {
    toast.error(
      (e as any).response.data.message ||
        'Error updating food item. Please try again later.',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
  }
}

export const deleteFoodItem = async (
  restaurantId: number,
  foodItemId: number
) => {
  try {
    const response = await api.delete(
      `/api/restaurants/${restaurantId}/food-items/${foodItemId}`
    )
    return response.data
  } catch (e) {
    toast.error(
      (e as any).response.data.message ||
        'Error deleting food item. Please try again later.',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
  }
}
