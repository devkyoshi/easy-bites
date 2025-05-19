import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  getRestaurantAdminDetails,
  getRestaurantOrders,
  updateOrderStatus,
} from '@/services/restaurant-service.ts'
import {
  AdminRestaurantResult,
  OrderAcceptance,
  RestaurantOrder,
} from '@/services/types/restaurant.type.ts'
import {
  CheckCircle,
  Clock,
  Truck,
  Check,
  AlertCircle,
  Package,
  Utensils,
  Phone,
  MapPin,
  Calendar,
  Wallet,
  ClipboardList,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth-context.tsx'
import { router } from '@/lib/router.ts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Header } from '@/components/layout/header.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'

export function RestaurantOrderRequests() {
  const [orders, setOrders] = useState<RestaurantOrder[]>([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()
  const [restaurantDetails, setRestaurantDetails] =
    useState<AdminRestaurantResult | null>(null)
  const [filter, setFilter] = useState('ALL')

  // Dashboard stats
  const dashboardStats = useMemo(() => {
    const totalOrders = orders.length
    const pendingOrders = orders.filter(
      (o) => o.orderStatus === 'PENDING'
    ).length
    const acceptedOrders = orders.filter(
      (o) => o.orderStatus === 'RESTAURANT_ACCEPTED'
    ).length
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    )

    return {
      totalOrders,
      pendingOrders,
      acceptedOrders,
      totalRevenue: totalRevenue.toFixed(2),
    }
  }, [orders])

  // Status icons mapping
  const statusIcons = {
    PENDING: <Clock className='mr-2 h-4 w-4' />,
    RESTAURANT_ACCEPTED: <Check className='mr-2 h-4 w-4' />,
    DRIVER_ASSIGNED: <Truck className='mr-2 h-4 w-4' />,
    DELIVERED: <Package className='mr-2 h-4 w-4' />,
    DELIVERY_FAILED: <AlertCircle className='mr-2 h-4 w-4' />,
  }

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return
      try {
        const data = await getRestaurantAdminDetails(currentUser.userId)
        if (!data?.restaurantId) {
          router.navigate({ to: '/restaurants/restaurant-registration' })
        }
        setRestaurantDetails(data || null)
      } finally {
        setLoading(false)
      }
    }
    loadData().then()
  }, [currentUser])

  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (!restaurantDetails?.restaurantId) return
        const data = await getRestaurantOrders(restaurantDetails?.restaurantId)
        const uniqueOrders = new Map(
          data?.map((order) => [order?.orderId, order])
        )
        setOrders(Array.from(uniqueOrders.values()))
      } finally {
        setLoading(false)
      }
    }
    loadOrders().then()
  }, [restaurantDetails?.restaurantId])

  const handleAcceptOrder = async (orderId: number) => {
    try {
      const request = {
        orderId,
        status: 'RESTAURANT_ACCEPTED',
      } as OrderAcceptance
      await updateOrderStatus(request)
      setOrders(
        orders.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: 'RESTAURANT_ACCEPTED' }
            : order
        )
      )
      toast('Order accepted successfully', {
        icon: <CheckCircle className='h-5 w-5 text-green-500' />,
      })
    } catch (_error) {
      toast('Failed to update order status', {
        icon: <AlertCircle className='h-5 w-5 text-red-500' />,
      })
    }
  }

  const StatusBadge = ({ status }: { status: string }) => (
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    <Badge className={`flex items-center text-sm ${statusColors[status]}`}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*@ts-expect-error*/}
      {statusIcons[status] || <Clock className='mr-2 h-4 w-4' />}
      {formatStatus(status)}
    </Badge>
  )

  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    RESTAURANT_ACCEPTED: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    DRIVER_ASSIGNED: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    DELIVERED: 'bg-green-100 text-green-800 hover:bg-green-200',
    DELIVERY_FAILED: 'bg-red-100 text-red-800 hover:bg-red-200',
  }

  const filteredData = useMemo(() => {
    if (filter === 'ALL') return orders
    return orders.filter((order) => order.orderStatus === filter)
  }, [filter, orders])

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .replace(
        /\w\S*/g,
        (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      )
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-4'>
          <Package className='text-primary h-5 w-5' />
          <div className={'p-2'}>
            <h1 className='mt-1 text-xl font-bold'>
              Restaurant Order Requests
            </h1>
            <p className='text-muted-foreground -mt-1 text-sm'>
              Review and manage incoming customer orders
            </p>
          </div>
        </div>
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Dashboard Stats */}
      <div className='mt-5 grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='transition-shadow hover:shadow-md'>
          <CardContent className='flex items-center justify-between p-4'>
            <div>
              <p className='text-muted-foreground text-sm'>Total Orders</p>
              <p className='text-2xl font-bold'>{dashboardStats.totalOrders}</p>
            </div>
            <ClipboardList className='text-primary h-8 w-8' />
          </CardContent>
        </Card>

        <Card className='transition-shadow hover:shadow-md'>
          <CardContent className='flex items-center justify-between p-4'>
            <div>
              <p className='text-muted-foreground text-sm'>Pending Orders</p>
              <p className='text-2xl font-bold'>
                {dashboardStats.pendingOrders}
              </p>
            </div>
            <Clock className='h-8 w-8 text-amber-500' />
          </CardContent>
        </Card>

        <Card className='transition-shadow hover:shadow-md'>
          <CardContent className='flex items-center justify-between p-4'>
            <div>
              <p className='text-muted-foreground text-sm'>Accepted Orders</p>
              <p className='text-2xl font-bold'>
                {dashboardStats.acceptedOrders}
              </p>
            </div>
            <CheckCircle className='h-8 w-8 text-green-500' />
          </CardContent>
        </Card>

        <Card className='transition-shadow hover:shadow-md'>
          <CardContent className='flex items-center justify-between p-4'>
            <div>
              <p className='text-muted-foreground text-sm'>Total Revenue</p>
              <p className='text-2xl font-bold'>
                Rs. {dashboardStats.totalRevenue}
              </p>
            </div>
            <Wallet className='h-8 w-8 text-purple-500' />
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className='flex items-center justify-between p-4'>
        <h2 className='text-lg font-semibold'>Order List</h2>
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground text-sm'>Filter by:</span>
          <Button
            variant={filter === 'ALL' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilter('ALL')}
          >
            All
          </Button>
          {Object.keys(statusColors).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size='sm'
              onClick={() => setFilter(status)}
              //eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-expect-error
              className={`${statusColors[status].split(' ')[0]} ${filter === status ? 'text-white' : ''}`}
            >
              {formatStatus(status)}
            </Button>
          ))}
        </div>
      </div>

      <div className='space-y-4 p-4'>
        {/* Desktop Table */}
        <Card className='hidden border-none pt-0 pb-0 lg:block'>
          <Table>
            <TableHeader className='bg-muted/50'>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className='h-4 w-32' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-24' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-16' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-24' />
                      </TableCell>
                      <TableCell className='text-right'>
                        <Skeleton className='h-8 w-24' />
                      </TableCell>
                    </TableRow>
                  ))
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    <Package className='mx-auto mb-2 h-8 w-8' />
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((order) => (
                  <TableRow key={order.orderId} className='hover:bg-muted/50'>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Utensils className='h-4 w-4' />
                        <div>
                          <p>{order.customerName}</p>
                          <p className='text-muted-foreground text-sm'>
                            {order.customerPhone}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant='ghost' size='sm' className='gap-1'>
                            <span>{order.orderItems.length}</span>
                            <Package className='h-4 w-4' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-64'>
                          <div className='space-y-2'>
                            <h4 className='font-semibold'>Order Items</h4>
                            {order.orderItems.map((item) => (
                              <div
                                key={item.itemId}
                                className='flex justify-between'
                              >
                                <span className='text-sm'>{item.itemName}</span>
                                <span className='text-sm font-medium'>
                                  Rs. {item.unitPrice.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>Rs. {order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.orderStatus} />
                    </TableCell>
                    <TableCell className='text-right'>
                      {order.orderStatus === 'PENDING' && (
                        <div className='flex justify-end gap-2'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size='sm'
                                onClick={() => handleAcceptOrder(order.orderId)}
                              >
                                <CheckCircle className='mr-2 h-4 w-4' />
                                Accept
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Accept Order</TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Mobile Cards */}
        <div className='space-y-4 lg:hidden'>
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className='space-y-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-3 w-48' />
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <Skeleton className='h-3 w-full' />
                    <Skeleton className='h-3 w-full' />
                    <Skeleton className='h-3 w-full' />
                  </CardContent>
                </Card>
              ))
          ) : filteredData.length === 0 ? (
            <Card>
              <CardContent className='py-12 text-center'>
                <Package className='mx-auto mb-4 h-8 w-8' />
                <p>No orders found</p>
              </CardContent>
            </Card>
          ) : (
            filteredData.map((order) => (
              <Card key={order.orderId} className='hover:shadow-md'>
                <CardContent className='space-y-4 p-4'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <div className='mb-2 flex items-center gap-2'>
                        <Package className='h-5 w-5' />
                        <span className='font-medium'>
                          Order #{order.orderId}
                        </span>
                      </div>
                      <StatusBadge status={order.orderStatus} />
                    </div>
                    <span className='text-lg font-semibold'>
                      Rs. {order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      <span className='text-sm'>
                        {format(
                          new Date(order.orderDate),
                          'MMM dd, yyyy HH:mm'
                        )}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Phone className='h-4 w-4' />
                      <span className='text-sm'>{order.customerPhone}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      <span className='line-clamp-1 text-sm'>
                        {order.deliveryAddress}
                      </span>
                    </div>
                  </div>

                  {order.orderStatus === 'PENDING' && (
                    <Button
                      size='sm'
                      className='w-full'
                      onClick={() => handleAcceptOrder(order.orderId)}
                    >
                      <CheckCircle className='mr-2 h-4 w-4' />
                      Accept Order
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  )
}
