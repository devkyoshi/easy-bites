// src/services/order-service.ts
import { api } from '@/config/axios.ts'
import { IOrderDetails } from '@/services/types/order.type.ts'

export const getOrderDetailsById = async (orderId: number) => {
  try {
    const response = await api.get(`/api/order/order/${orderId}`)
    return response.data.result as IOrderDetails
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    throw e
  }
}
