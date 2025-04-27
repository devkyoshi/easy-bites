import { useEffect, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import {
  IconClock,
  IconPhone,
  IconMapPin,
  IconMail,
  IconShoppingCartPlus,
  IconInfoCircle,
} from '@tabler/icons-react'
import { getRestaurantDetailsByRestaurant } from '@/services/restaurant-service.ts'
import {
  IRestaurantDetails,
  IFoodItem,
} from '@/services/types/restaurant.type.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Header } from '@/components/layout/header.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { Cart } from '@/features/restaurants/customer/components/cart.tsx'

type LocationState = { restaurantId: number }

export function RestaurantDetails() {
  const location = useLocation()
  const [restaurantDetails, setRestaurantDetails] =
    useState<IRestaurantDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { restaurantId } = location.state as unknown as LocationState

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        if (!restaurantId) return
        return (await getRestaurantDetailsByRestaurant(
          restaurantId
        )) as IRestaurantDetails
      } catch (_error) {
        return setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurantDetails().then((r) => {
      if (r) setRestaurantDetails(r)
    })
  }, [restaurantId])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!restaurantDetails) {
    return (
      <div className='flex h-screen flex-col items-center justify-center gap-4'>
        <IconInfoCircle className='text-muted-foreground h-16 w-16' />
        <h2 className='text-2xl font-semibold'>Restaurant not found</h2>
        <p className='text-muted-foreground'>
          The requested restaurant could not be loaded
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='flex items-center gap-4'>
          <h1 className='text-2xl font-bold'>{restaurantDetails?.name}</h1>
          <p className='text-muted-foreground text-sm'>
            {restaurantDetails?.description}
          </p>
        </div>
        <div className='ml-auto flex items-center gap-4'>
          <Cart />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <div className='container mx-auto space-y-8 px-4 py-8'>
        {/* Restaurant Header */}
        <div className='flex flex-col items-start gap-6 md:flex-row'>
          <img
            src={restaurantDetails.logoUrl}
            alt={restaurantDetails.name}
            className='h-32 w-32 rounded-lg border object-cover'
          />
          <div className='flex-1 space-y-2'>
            <div className='flex items-center gap-4'>
              <h1 className='text-3xl font-bold'>{restaurantDetails.name}</h1>
              <Badge
                variant={restaurantDetails.isOpen ? 'default' : 'destructive'}
              >
                {restaurantDetails.isOpen ? 'Open Now' : 'Closed'}
              </Badge>
            </div>
            <p className='text-muted-foreground'>
              {restaurantDetails.description}
            </p>

            <div className='flex flex-wrap gap-4 pt-2'>
              <div className='flex items-center gap-2 text-sm'>
                <IconMapPin className='text-muted-foreground h-4 w-4' />
                <span>{restaurantDetails.address}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <IconPhone className='text-muted-foreground h-4 w-4' />
                <span>{restaurantDetails.phone}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <IconMail className='text-muted-foreground h-4 w-4' />
                <span>{restaurantDetails.email}</span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className='pb-2'>
            <h2 className='text-xl font-semibold'>Opening Hours</h2>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex items-center gap-2'>
              <IconClock className='text-muted-foreground h-5 w-5' />
              <span>
                {restaurantDetails.openingHour} -{' '}
                {restaurantDetails.closingHour}
              </span>
            </div>
            <div className='text-muted-foreground text-sm'>
              Open on: {restaurantDetails.daysOpen.join(', ')}
            </div>
          </CardContent>
        </Card>

        {/* Hours & Categories */}
        <div className='grid grid-cols-1 gap-6'>
          {/* Menu Categories */}
          <div className='space-y-6 md:col-span-2'>
            {restaurantDetails.menuCategories.map((category) => (
              <section key={category.categoryId} className='space-y-4'>
                <h2 className='border-b pb-2 text-2xl font-semibold'>
                  {category.name}
                </h2>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {restaurantDetails.foodItems
                    .filter((item) => item.categoryName === category.name)
                    .map((item) => (
                      <FoodItemCard key={item.foodItemId} item={item} />
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const FoodItemCard = ({ item }: { item: IFoodItem }) => (
  <Card className='transition-shadow hover:shadow-lg'>
    <CardContent className='flex gap-4 p-4'>
      <img
        src={item.imageUrl}
        alt={item.name}
        className='h-24 w-24 rounded-md object-cover'
      />
      <div className='flex-1 space-y-2'>
        <div className='flex items-start justify-between'>
          <h3 className='text-lg font-medium'>{item.name}</h3>
          <span className='font-medium'>${item.price.toFixed(2)}</span>
        </div>
        <p className='text-muted-foreground line-clamp-2 text-sm'>
          {item.description}
        </p>
        <Button size='sm' className='mt-2 gap-2'>
          <IconShoppingCartPlus className='h-4 w-4' />
          Add to Cart
        </Button>
      </div>
    </CardContent>
  </Card>
)

const LoadingSkeleton = () => (
  <div className='container mx-auto space-y-8 px-4 py-8'>
    <div className='flex items-start gap-6'>
      <Skeleton className='h-32 w-32 rounded-lg' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-4 w-3/4' />
        <div className='space-y-1 pt-2'>
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-4 w-56' />
        </div>
      </div>
    </div>

    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
      <Skeleton className='h-48' />
      <div className='space-y-6 md:col-span-2'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='space-y-4'>
            <Skeleton className='h-6 w-32' />
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className='h-36' />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
