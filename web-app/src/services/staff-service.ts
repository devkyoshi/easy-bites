import { api } from '@/config/axios.ts'
import { toast } from 'sonner'

export type VehicleType = 'BIKE' | 'CAR' | 'VAN' | 'THREE_WHEELER'

export const getVehicleTypes = () => {
  return [
    { label: 'Bike', value: 'BIKE' },
    { label: 'Car', value: 'CAR' },
    { label: 'Van', value: 'VAN' },
    { label: 'Three Wheeler', value: 'THREE_WHEELER' },
  ]
}

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

interface RegisterDriverRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  username: string
  userType: 'DELIVERY_PERSON'
  roles: 'ROLE_DELIVERY_PERSON'[]
  vehicleType: string
  vehicleNumber: string
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
        'Error occurred while registering restaurant manager',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
  }
}

export const registerDeliveryPerson = async (
  request: RegisterDriverRequest
) => {
  try {
    const response = await api.post(`/auth/register-driver`, request)

    return response.data
  } catch (e) {
    toast.error(
      (e as any).response.data.message ||
        'Error occurred while registering driver',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
  }
}
