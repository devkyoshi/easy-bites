import { api } from '@/config/axios.ts'
import {
  AddFoodItemRequest,
  AdminRestaurantResult,
  IRestaurantDetails,
  OrderAcceptance,
  RestaurantOrder,
} from '@/services/types/restaurant.type.ts'
import { toast } from 'sonner'

export const getRestaurantDetailsByRestaurant = async (
  restaurantId: number
) => {
  try {
    if (!restaurantId) return
    const response = await api.get(`/api/restaurants/${restaurantId}`)
    return response.data.result as IRestaurantDetails
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}

export const getRestaurantAdminDetails = async (adminId: number) => {
  try {
    if (!adminId) return
    const response = await api.get(
      `/api/restaurants/admin-restaurants/${adminId}`
    )
    return response.data.result as AdminRestaurantResult
  } catch (e) {
    // eslint-disable-next-line no-console
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

    if (response.data.success) {
      toast.success('Food item removed successfully', {
        duration: 5000,
        position: 'top-center',
      })
    }

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

export const updateMenuCategory = async (
  restaurantId: number,
  categoryId: number,
  categoryName: string
) => {
  try {
    const response = await api.put(
      `/api/restaurants/${restaurantId}/categories/${categoryId}`,
      { name: categoryName }
    )

    if (response.data.success) {
      toast.success('Menu category updated successfully', {
        duration: 5000,
        position: 'top-center',
      })
    }
    return response.data
  } catch (e) {
    toast.error(
      (e as any).response.data.message ||
        'Error updating menu category. Please try again later.',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
  }
}

export const deleteMenuCategory = async (
  restaurantId: number,
  categoryId: number
) => {
  try {
    const response = await api.delete(
      `/api/restaurants/${restaurantId}/categories/${categoryId}`
    )

    if (response.data.success) {
      toast.success('Menu category removed successfully', {
        duration: 5000,
        position: 'top-center',
      })
    }
    return response.data
  } catch (e) {
    toast.error(
      (e as any).response.data.message ||
        'Error deleting menu category. Please try again later.',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
  }
}

export const addMenuCategory = async (
  restaurantId: number,
  categoryName: string
) => {
  try {
    const response = await api.post(
      `/api/restaurants/${restaurantId}/categories`,
      { name: categoryName }
    )

    if (response.data.success) {
      toast.success('Menu category added successfully', {
        duration: 5000,
        position: 'top-center',
      })
    }

    return response.data
  } catch (e) {
    toast.error(
      (e as any).response.data.message ||
        'Error adding menu category. Please try again later.',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
  }
}

export interface IRestaurantCreateDetails {
  name: string
  description: string
  address: string
  phone: string
  email: string
  logoUrl: string
  isOpen: boolean
  openingHour: string
  closingHour: string
  daysOpen: string[]
  managerId: number
}

export const createRestaurant = async (
  restaurant: IRestaurantCreateDetails
) => {
  try {
    const response = await api.post(`/api/restaurants/create`, restaurant)

    if (response.data.success) {
      toast.success('Restaurant created successfully', {
        duration: 5000,
        position: 'top-center',
      })
    }

    return response.data
  } catch (e) {
    toast.error(
      (e as any).response.data.message ||
        'Error creating restaurant. Please try again later.',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
  }
}

export const getRestaurantOrders = async (restaurantId: number) => {
  try {
    const response = await api.get(`/api/restaurants/${restaurantId}/orders`)

    return response.data.result as RestaurantOrder[]
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}

export const updateOrderStatus = async (request: OrderAcceptance) => {
  try {
    const response = await api.put(
      `/api/order/${request.orderId}/status`,
      request
    )

    if (response.data.success) {
      toast.success('Order status updated successfully', {
        duration: 5000,
        position: 'top-center',
      })
    }

    return response.data
  } catch (e) {
    toast.error(
      (e as any).response.data.message ||
        'Error updating order status. Please try again later.',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
  }
}
