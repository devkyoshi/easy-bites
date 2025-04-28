// src/features/orders/order-details.tsx
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useLocation } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import {
  IconClock,
  IconPhone,
  IconMapPin,
  IconInfoCircle,
  IconCheck,
  IconX,
  IconCreditCard,
  IconShoppingBag,
  IconArrowLeft,
  IconBuildingStore,
  IconUser,
} from '@tabler/icons-react'
import { api } from '@/config/axios.ts'
import { getOrderDetailsById } from '@/services/order-service.ts'
import { IOrderDetails, IOrderItem } from '@/services/types/order.type.ts'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header.tsx'

const statusIcons = {
  PENDING: <IconClock className='h-5 w-5 text-yellow-500' />,
  DELIVERED: <IconCheck className='h-5 w-5 text-green-500' />,
  DELIVERY_FAILED: <IconX className='h-5 w-5 text-red-500' />,
  CANCELLED: <IconX className='h-5 w-5 text-red-500' />,
  DRIVER_ASSIGNED: <IconUser className='h-5 w-5 text-blue-500' />,
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  DELIVERED: 'bg-green-100 text-green-800',
  DELIVERY_FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-red-100 text-red-800',
  DRIVER_ASSIGNED: 'bg-blue-100 text-blue-800',
}

type LocationState = { orderId: number }

interface GroupedItems {
  [restaurantName: string]: {
    restaurantId: number | string
    items: IOrderItem[]
    subtotal: number
  }
}

export function OrderDetails() {
  const [orderDetails, setOrderDetails] = useState<IOrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { orderId } = location.state as unknown as LocationState

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderIdNum = parseInt(String(orderId))
        if (isNaN(orderIdNum)) return

        const response = await api.get(`/api/order/order/${orderIdNum}`)
        const data = response.data as IOrderDetails
        setOrderDetails(data)
      } catch (_error) {
        toast.error('Error occurred while fetching order details', {
          duration: 5000,
          position: 'top-center',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails().then()
  }, [orderId])

  const groupItemsByRestaurant = () => {
    if (!orderDetails) return {}

    return orderDetails.items.reduce<GroupedItems>((acc, item) => {
      if (!acc[item.restaurantName]) {
        acc[item.restaurantName] = {
          restaurantId: item.restaurantId,
          items: [],
          subtotal: 0,
        }
      }
      acc[item.restaurantName].items.push(item)
      acc[item.restaurantName].subtotal += item.totalPrice
      return acc
    }, {})
  }

  const handleCancelOrder = async () => {
    if (!orderDetails) return

    try {
      setCancelling(true)
      toast.success('Order cancelled successfully', {
        duration: 5000,
        position: 'top-center',
      })
      const updatedOrder = await getOrderDetailsById(orderDetails.id)
      setOrderDetails(updatedOrder)
    } catch (_error) {
      toast.error('Failed to cancel order', {
        duration: 5000,
        position: 'top-center',
      })
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }
  if (!orderDetails) {
    return (
      <div className='flex h-screen flex-col items-center justify-center gap-4'>
        <IconInfoCircle className='text-muted-foreground h-16 w-16' />
        <h2 className='text-2xl font-semibold'>Order not found</h2>
        <p className='text-muted-foreground'>
          The requested order could not be loaded
        </p>
        <Button onClick={() => navigate({ to: '/orders' })}>
          Back to Orders
        </Button>
      </div>
    )
  }

  const groupedItems = groupItemsByRestaurant()

  return (
    <div className='container mx-auto space-y-8 px-4 py-8'>
      <Header>
        <Button
          variant='ghost'
          onClick={() => navigate({ to: '/orders' })}
          className='gap-2'
        >
          <IconArrowLeft className='h-5 w-5' />
          Back to Orders
        </Button>
      </Header>

      <div className='mx-auto max-w-4xl space-y-6'>
        {/* Order Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>Order #{orderDetails.id}</h1>
            <p className='text-muted-foreground'>
              {format(
                new Date(orderDetails.createdAt),
                "MMMM d, yyyy 'at' h:mm a"
              )}
            </p>
          </div>
          <Badge
            className={`${statusColors[orderDetails.status]} px-3 py-1.5 text-sm font-medium`}
          >
            <div className='flex items-center gap-1'>
              {statusIcons[orderDetails.status]}
              {orderDetails.status}
            </div>
          </Badge>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              {Object.keys(groupedItems).length} restaurant(s)
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {Object.entries(groupedItems).map(([restaurantName, group]) => (
              <div key={restaurantName} className='space-y-4'>
                <div className='flex items-center gap-2 text-lg font-medium'>
                  <IconBuildingStore className='text-muted-foreground h-5 w-5' />
                  <span>{restaurantName}</span>
                </div>

                <div className='space-y-3 pl-7'>
                  {group.items.map((item) => (
                    <div
                      key={item.itemId}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-4'>
                        {item.itemImage && (
                          <img
                            src={item.itemImage}
                            alt={item.itemName}
                            className='h-16 w-16 rounded-md object-cover'
                          />
                        )}
                        <div>
                          <p className='font-medium'>{item.itemName}</p>
                          <p className='text-muted-foreground text-sm'>
                            ${item.unitPrice} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className='font-medium'>${item.totalPrice}</p>
                    </div>
                  ))}
                </div>

                <div className='flex justify-between border-t pt-2 pl-7'>
                  <span className='text-muted-foreground'>
                    Subtotal ({group.items.length} items)
                  </span>
                  <span>${group.subtotal.toFixed(2)}</span>
                </div>
              </div>
            ))}

            <div className='space-y-2 border-t pt-4'>
              <div className='flex justify-between pt-2 text-lg font-bold'>
                <span>Total</span>
                <span>${orderDetails.totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-3'>
              <IconMapPin className='text-muted-foreground h-5 w-5' />
              <div>
                <p className='font-medium'>Delivery Address</p>
                <p className='text-muted-foreground'>
                  {orderDetails.deliveryAddress}
                </p>
                {orderDetails.deliveryInstructions && (
                  <p className='text-muted-foreground mt-1 text-sm'>
                    <span className='font-medium'>Instructions:</span>{' '}
                    {orderDetails.deliveryInstructions}
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <IconPhone className='text-muted-foreground h-5 w-5' />
              <div>
                <p className='font-medium'>Delivery Driver Contact Phone</p>
                <p className='text-muted-foreground'>
                  here{orderDetails.contactPhone}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <IconUser className='text-muted-foreground h-5 w-5' />
              <div>
                <p className='font-medium'>Delivery Driver Name</p>
                <p className='text-muted-foreground'>
                  here{orderDetails.contactPhone}
                </p>
              </div>
            </div>

            {orderDetails.estimatedDeliveryTime && (
              <div className='flex items-center gap-3'>
                <IconClock className='text-muted-foreground h-5 w-5' />
                <div>
                  <p className='font-medium'>Estimated Delivery</p>
                  <p className='text-muted-foreground'>
                    {format(
                      new Date(orderDetails.estimatedDeliveryTime),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card
          className={
            orderDetails.paymentStatus === 'PAID'
              ? 'border-green-500 bg-green-50'
              : orderDetails.paymentStatus === 'NOT_PAID'
                ? 'border-red-200 bg-red-50'
                : 'border-red-500 bg-red-100'
          }
        >
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex items-center gap-3'>
              <IconCreditCard className='text-muted-foreground h-5 w-5' />
              <div>
                <p className='font-medium'>Payment Method</p>
                <p className='text-muted-foreground'>
                  {orderDetails.paymentMethod}
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-3'>
                <IconShoppingBag className='text-muted-foreground h-5 w-5' />
                <div>
                  <p className='font-medium'>Payment Status</p>
                  <p
                    className={
                      orderDetails.paymentStatus === 'FAIL'
                        ? 'font-semibold text-red-600'
                        : orderDetails.paymentStatus === 'PAID'
                          ? 'font-semibold text-green-600'
                          : 'font-semibold text-yellow-700'
                    }
                  >
                    {orderDetails.paymentStatus === 'PAID' && 'Paid'}
                    {orderDetails.paymentStatus === 'NOT_PAID' && 'Not Paid'}
                    {orderDetails.paymentStatus === 'FAIL' && 'Fail'}
                  </p>
                </div>
              </div>

              {orderDetails.paymentStatus === 'FAIL' && (
                <div className='mt-2 rounded-md border border-red-300 bg-red-50 p-4'>
                  <p className='mb-2 font-medium text-red-600'>
                    Please contact customer support
                  </p>
                  <div className='flex items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600'>
                      CS
                    </div>
                    <div>
                      <p className='font-semibold'>Withanage Wanigapachi</p>
                      <p className='text-sm text-gray-600'>
                        Email: support@example.com
                      </p>
                      <p className='text-sm text-gray-600'>
                        Phone: +94 (555) 123-4567
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {orderDetails.status === 'DRIVER_ASSIGNED' && (
          <Button
            variant='default'
            onClick={handleCancelOrder}
            disabled={cancelling}
          >
            Track driver
          </Button>
        )}

        {/* Actions */}
        {(orderDetails.status === 'PENDING' ||
          orderDetails.paymentStatus === 'NOT_PAID') && (
          <div className='mt-4 flex justify-end gap-3'>
            {orderDetails.paymentStatus === 'NOT_PAID' && (
              <Button
                //TODO: Implement payment flow
                // eslint-disable-next-line no-console
                onClick={() => console.log('Trigger payment flow')}
                className='bg-blue-600 text-white transition hover:bg-blue-700'
              >
                Pay
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className='container mx-auto space-y-8 px-4 py-8'>
    <div className='mx-auto max-w-4xl space-y-6'>
      {/* Order Header Skeleton */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-6 w-24' />
      </div>

      {/* Order Summary Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-48' />
        </CardHeader>
        <CardContent className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <Skeleton className='h-16 w-16 rounded-md' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-24' />
                </div>
              </div>
              <Skeleton className='h-4 w-16' />
            </div>
          ))}

          <div className='space-y-2 border-t pt-4'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='flex justify-between'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-16' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
        </CardHeader>
        <CardContent className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='flex items-center gap-3'>
              <Skeleton className='h-5 w-5 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-48' />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Information Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
        </CardHeader>
        <CardContent className='space-y-2'>
          {[...Array(2)].map((_, i) => (
            <div key={i} className='flex items-center gap-3'>
              <Skeleton className='h-5 w-5 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-24' />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
)
