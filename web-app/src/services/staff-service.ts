import { api } from '@/config/axios.ts'
import { toast } from 'sonner'

interface RegisterRestaurantManagerRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  username: string
  userType: 'RESTAURANT_MANAGER'
  roles: 'ROLE_RESTAURANT_MANAGER'[]
  licenseNumber: string
}

export const registerRestaurantManager = async (
  request: RegisterRestaurantManagerRequest
) => {
  try {
    const response = await api.post(
      `/auth/register-restaurant-manager`,
      request
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
