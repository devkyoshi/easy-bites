// src/services/payment-service.ts
import { api } from '@/config/axios.ts'

// Function to initiate Stripe payment
export const initiateStripePayment = async (
  orderId: number,
  amount: number,
  description: string
) => {
  try {
    // Get the current origin for success and cancel URLs
    const origin = window.location.origin
    const successUrl = `${origin}/orders`
    const cancelUrl = `${origin}/orders`

    // Call the backend API to create a Stripe Checkout session
    const response = await api.post('/api/order/checkout-session', {
      orderId,
      amount,
      description,
      successUrl,
      cancelUrl
    })

    // Get the checkout URL from the response
    const { checkoutUrl } = response.data

    // Open the Stripe Checkout page in a new window
    window.open(checkoutUrl, '_blank')

    // Return a pending result - the actual payment status will be updated
    // when the user completes the payment and is redirected back to the success URL
    return {
      success: true,
      orderId,
      paymentStatus: 'PENDING'
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Payment initiation error:', error)
    throw error
  }
}

// Function to update payment status in the backend
export const updatePaymentStatus = async (orderId: number, paymentStatus: string) => {
  try {
    const response = await api.put(`/api/order/${orderId}/payment-status`, {
      paymentStatus
    })
    return response.data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating payment status:', error)
    throw error
  }
}
