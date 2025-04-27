import React, { useEffect, useState } from 'react'
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconMeat,
  IconInfoCircle,
  IconClock,
  IconSalad,
  IconCurrencyDollar,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react'
import {
  deleteFoodItem,
  getRestaurantAdminDetails,
} from '@/services/restaurant-service.ts'
import {
  AdminRestaurantResult,
  FoodItem,
} from '@/services/types/restaurant.type.ts'
import { SettingsIcon } from 'lucide-react'
import { useAuth } from '@/stores/auth-context.tsx'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { MenuCategoryTable } from '@/features/restaurants/admin/components/menu-items.tsx'
import { FoodItemForm } from '../components/fooditem-dialog'

export const RestaurantManagementTab = () => {
  const { currentUser } = useAuth()
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [restaurantDetails, setRestaurantDetails] =
    useState<AdminRestaurantResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return
      try {
        const data = await getRestaurantAdminDetails(currentUser.userId)
        setRestaurantDetails(data || null)
      } finally {
        setIsLoading(false)
      }
    }
    loadData().then()
  }, [currentUser, refreshTrigger])

  const stats = [
    {
      title: 'Total Items',
      value: restaurantDetails?.foodItems.length,
      icon: <IconMeat className='h-5 w-5' />,
    },
    {
      title: 'Available Now',
      value: restaurantDetails?.foodItems.filter((item) => item.isAvailable)
        .length,
      icon: <IconSalad className='h-5 w-5' />,
    },
    {
      title: 'Avg. Price',
      value: `$${(
        (restaurantDetails?.foodItems.reduce(
          (acc, item) => acc + item.price,
          0
        ) || 0) / (restaurantDetails?.foodItems.length || 1)
      ).toFixed(2)}`,
      icon: <IconCurrencyDollar className='h-5 w-5' />,
    },
  ]

  if (isLoading) return <DashboardSkeleton />

  return (
    <>
      <Header>
        <div className='flex items-center gap-4'>
          <h1 className='text-2xl font-bold'>Restaurants</h1>
          <p className='text-muted-foreground text-sm'>
            Manage your restaurant details, food items, and menu categories.
          </p>
        </div>
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <div className='space-y-8 p-4'>
        {/* Restaurant Header */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between gap-4'>
            <div className='flex flex-row items-center gap-4'>
              <img
                src={restaurantDetails?.logo || '/placeholder-logo.png'}
                alt='Restaurant logo'
                className='h-16 w-16 rounded-lg object-cover'
              />
              <div className='grid gap-1'>
                <h1 className='text-2xl font-bold'>
                  {restaurantDetails?.restaurantName}
                </h1>
                <h1 className='text-sm'>{restaurantDetails?.description}</h1>
                <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                  <IconInfoCircle className='h-4 w-4' />
                  <p>{restaurantDetails?.address}</p>
                  <IconClock className='ml-2 h-4 w-4' />
                  <p>
                    {restaurantDetails?.openingHour} -{' '}
                    {restaurantDetails?.closingHour}
                  </p>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {restaurantDetails?.isOpen ? (
                <div
                  className={
                    'flex items-center gap-2 rounded-md border border-green-200 bg-green-100 p-2'
                  }
                >
                  <IconCircleCheck className='h-5 w-5 text-green-600' />
                  <span className='text-sm font-bold text-green-600'>
                    Open Now
                  </span>
                </div>
              ) : (
                <div
                  className={
                    'flex items-center gap-2 rounded-md border border-red-200 bg-red-100 p-2'
                  }
                >
                  <IconCircleX className='h-5 w-5 text-red-600' />
                  <span className='text-sm font-bold text-red-600'>
                    Closed Now
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <h3 className='text-sm font-medium'>{stat.title}</h3>
                    <div className='text-2xl font-bold'>{stat.value}</div>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <FoodItemTable
          restaurantDetails={restaurantDetails}
          setRefreshTrigger={setRefreshTrigger}
        />

        <MenuCategoryTable
          onUpdate={() => setRefreshTrigger((prev) => !prev)}
          restaurantId={restaurantDetails?.restaurantId || 0}
          menus={restaurantDetails?.menuCategories || []}
          foodItems={restaurantDetails?.foodItems || []}
        />
      </div>
    </>
  )
}

const DashboardSkeleton = () => (
  <div className='space-y-8'>
    <Skeleton className='h-[120px] w-full' />
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className='h-[120px] w-full' />
      ))}
    </div>
    <Skeleton className='h-[500px] w-full' />
  </div>
)

const FoodItemTable = ({
  restaurantDetails,
  setRefreshTrigger,
}: {
  restaurantDetails: AdminRestaurantResult | null
  setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(
    null
  )
  const [openForm, setOpenForm] = useState(false)

  const handleDelete = async (foodItemId: number) => {
    if (!restaurantDetails) return

    await deleteFoodItem(restaurantDetails.restaurantId, foodItemId)
    setRefreshTrigger((prev) => !prev)
  }

  return (
    <>
      <Card>
        <CardHeader className='flex items-center justify-between space-y-0'>
          <CardTitle>Food Items</CardTitle>
          <Button
            onClick={() => {
              setSelectedFoodItem(null)
              setOpenForm(true)
            }}
          >
            <IconPlus className='mr-2 h-4 w-4' />
            Add Food Item
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurantDetails?.foodItems?.map((item) => (
                <TableRow key={item.foodItemId}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center gap-3'>
                      <img
                        src={item.imageUrl || '/placeholder-food.png'}
                        alt={item.name}
                        className='h-10 w-10 rounded-md object-cover'
                      />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className='max-w-[200px] truncate'>
                    {item.description}
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.isAvailable ? 'default' : 'destructive'}
                      className={
                        item.isAvailable ? 'bg-green-500 text-white' : ''
                      }
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </TableCell>

                  <TableCell>{item.stockQuantityPerDay}</TableCell>
                  <TableCell>{item.categoryName}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <SettingsIcon className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedFoodItem(item)
                            setOpenForm(true)
                          }}
                        >
                          <IconEdit className='mr-2 h-4 w-4' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-red-600'
                          onClick={() => handleDelete(item.foodItemId)}
                        >
                          <IconTrash className='mr-2 h-4 w-4' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <FoodItemForm
        open={openForm}
        onOpenChange={setOpenForm}
        foodItem={selectedFoodItem}
        onSuccess={() => {
          setRefreshTrigger((prev) => !prev)
        }}
        restaurantId={restaurantDetails?.restaurantId || 0}
        menuCategories={restaurantDetails?.menuCategories || []}
      />
    </>
  )
}
