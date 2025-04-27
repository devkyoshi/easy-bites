import { useNavigate } from '@tanstack/react-router'
import {
  IconClock,
  IconCircleCheck,
  IconCircleX,
  IconPhoto,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button.tsx'
import { Card } from '@/components/ui/card.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import {
  IRestaurant,
  useRestaurant,
} from '@/features/restaurants/context/restaurant-context.tsx'

export const RestaurantPageContent = () => {
  const { restaurants, loading } = useRestaurant()

  const navigate = useNavigate()

  const handleNavigateToDetailPage = (restaurant: IRestaurant) => {
    navigate({
      to: '/restaurants/restaurant-details',
      state: { restaurantId: restaurant.restaurantId } as never,
    }).then()
  }

  if (loading) {
    return (
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {[...Array(6)].map((_, index) => (
          <Card key={index} className='p-4'>
            <Skeleton className='mb-4 h-48 w-full rounded-lg' />
            <div className='space-y-2'>
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      {/* <h1 className="text-lg font-bold mb-6">Available Restaurants</h1>*/}

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {restaurants?.map((restaurant, index) => (
          <div key={index}>
            <Card className='h-full overflow-hidden'>
              <div className='bg-muted relative aspect-video'>
                {restaurant.logoUrl ? (
                  <img
                    src={restaurant.logoUrl}
                    alt={restaurant.name}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <IconPhoto className='text-muted-foreground h-16 w-16' />
                  </div>
                )}
              </div>

              <div className='p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <h3 className='text-xl font-semibold'>{restaurant.name}</h3>
                  <div className='flex items-center gap-1'>
                    {restaurant.isOpen ? (
                      <>
                        <IconCircleCheck className='h-5 w-5 text-green-600' />
                        <span className='text-sm text-green-600'>Open Now</span>
                      </>
                    ) : (
                      <>
                        <IconCircleX className='h-5 w-5 text-red-600' />
                        <span className='text-sm text-red-600'>Closed</span>
                      </>
                    )}
                  </div>
                </div>

                <p className='text-muted-foreground mb-4 line-clamp-2 text-sm'>
                  {restaurant.description}
                </p>

                <Button
                  className='w-full'
                  variant='outline'
                  onClick={() => handleNavigateToDetailPage(restaurant)}
                >
                  View Menu
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {restaurants?.length === 0 && !loading && (
        <div className='flex h-96 flex-col items-center justify-center text-center'>
          <IconClock className='text-muted-foreground mb-4 h-16 w-16' />
          <h2 className='mb-2 text-2xl font-semibold'>
            No Restaurants Available
          </h2>
          <p className='text-muted-foreground'>Check back later for updates</p>
        </div>
      )}
    </div>
  )
}
