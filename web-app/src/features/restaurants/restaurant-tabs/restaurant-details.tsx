import { useLocation } from '@tanstack/react-router'
import { useEffect, useState } from "react"
import { getRestaurantDetailsByRestaurant } from "@/services/restaurant-service.ts"
import { IRestaurantDetails, IFoodItem} from "@/services/types/restaurant.type.ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    IconClock,
    IconPhone,
    IconMapPin,
    IconMail,
    IconShoppingCartPlus,
    IconInfoCircle
} from "@tabler/icons-react"
import {Header} from "@/components/layout/header.tsx";
import {Cart} from "@/features/restaurants/components/cart.tsx";
import {ThemeSwitch} from "@/components/theme-switch.tsx";
import {ProfileDropdown} from "@/components/profile-dropdown.tsx";
import {toast} from "sonner";
import {CartProvider, useCart} from "@/features/cart/context/cart-context.tsx";

type LocationState = { restaurantId: number }

export function RestaurantDetails() {
    const location = useLocation()
    const [restaurantDetails, setRestaurantDetails] = useState<IRestaurantDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const { restaurantId } = location.state as unknown as LocationState

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                if (!restaurantId) return
                return  await getRestaurantDetailsByRestaurant(restaurantId) as IRestaurantDetails
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error("Error Occurred while fetching restaurant details")
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
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <IconInfoCircle className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">Restaurant not found</h2>
                <p className="text-muted-foreground">The requested restaurant could not be loaded</p>
            </div>
        )
    }

    return (
       <CartProvider>
           {/* ===== Top Heading ===== */}
           <Header>

               <div className='flex items-center gap-4'>
                   <h1 className='text-2xl font-bold'>{restaurantDetails?.name}</h1>
                   <p className='text-muted-foreground text-sm'>
                       {restaurantDetails?.description}
                   </p>
               </div>
               <div className='ml-auto flex items-center gap-4'>
                   <Cart/>
                   <ThemeSwitch />
                   <ProfileDropdown />
               </div>
           </Header>
           <div className="container mx-auto px-4 py-8 space-y-8">
               {/* Restaurant Header */}
               <div className="flex flex-col md:flex-row gap-6 items-start">
                   <img
                       src={restaurantDetails.logoUrl}
                       alt={restaurantDetails.name}
                       className="w-32 h-32 rounded-lg object-cover border"
                   />
                   <div className="space-y-2 flex-1">
                       <div className="flex items-center gap-4">
                           <h1 className="text-3xl font-bold">{restaurantDetails.name}</h1>
                           <Badge variant={restaurantDetails.isOpen ? 'default' : 'destructive'}>
                               {restaurantDetails.isOpen ? 'Open Now' : 'Closed'}
                           </Badge>
                       </div>
                       <p className="text-muted-foreground">{restaurantDetails.description}</p>

                       <div className="flex flex-wrap gap-4 pt-2">
                           <div className="flex items-center gap-2 text-sm">
                               <IconMapPin className="h-4 w-4 text-muted-foreground" />
                               <span>{restaurantDetails.address}</span>
                           </div>
                           <div className="flex items-center gap-2 text-sm">
                               <IconPhone className="h-4 w-4 text-muted-foreground" />
                               <span>{restaurantDetails.phone}</span>
                           </div>
                           <div className="flex items-center gap-2 text-sm">
                               <IconMail className="h-4 w-4 text-muted-foreground" />
                               <span>{restaurantDetails.email}</span>
                           </div>
                       </div>
                   </div>
               </div>

               <Card>
                   <CardHeader className="pb-2">
                       <h2 className="text-xl font-semibold">Opening Hours</h2>
                   </CardHeader>
                   <CardContent className="space-y-2">
                       <div className="flex items-center gap-2">
                           <IconClock className="h-5 w-5 text-muted-foreground" />
                           <span>{restaurantDetails.openingHour} - {restaurantDetails.closingHour}</span>
                       </div>
                       <div className="text-sm text-muted-foreground">
                           Open on: {restaurantDetails.daysOpen.join(', ')}
                       </div>
                   </CardContent>
               </Card>

               {/* Hours & Categories */}
               <div className="grid grid-cols-1  gap-6">

                   {/* Menu Categories */}
                   <div className="md:col-span-2 space-y-6">
                       {restaurantDetails.menuCategories.map((category) => (
                           <section key={category.categoryId} className="space-y-4">
                               <h2 className="text-2xl font-semibold border-b pb-2">{category.name}</h2>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {restaurantDetails.foodItems
                                       .filter(item => item.categoryName === category.name)
                                       .map((item) => (
                                           <FoodItemCard key={item.foodItemId} item={item} />
                                       ))}
                               </div>
                           </section>
                       ))}
                   </div>
               </div>
           </div></CartProvider>
    )
}

const FoodItemCard = ({ item }: { item: IFoodItem }) => {
    const { addItem } = useCart()
    const location = useLocation()
    const { restaurantId } = location.state as unknown as { restaurantId: number }

    const [restaurantDetails, setRestaurantDetails] = useState<IRestaurantDetails | null>(null)

    useEffect(() => {
        const fetchRestaurant = async () => {
            const data = await getRestaurantDetailsByRestaurant(restaurantId)
            setRestaurantDetails(data)
        }

        fetchRestaurant()
    }, [restaurantId])

    const handleAddToCart = async () => {
        if (!restaurantDetails) {
            toast.error("Restaurant details not loaded")
            return
        }

        try {
            await addItem({
                itemId: item.foodItemId,
                itemName: item.name,
                itemImage: item.imageUrl,
                quantity: 1,
                unitPrice: item.price,
                restaurantId: restaurantDetails.restaurantId.toString(),
                restaurantName: restaurantDetails.name
            })

            toast.success(`${item.name} added to cart`)
        } catch (error) {
            toast.error("Failed to add item to cart")
        }
    }

    return (
        <CartProvider>
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex gap-4">
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 rounded-md object-cover"
                />
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <Button
                        size="sm"
                        className="mt-2 gap-2"
                        onClick={handleAddToCart}
                    >
                        <IconShoppingCartPlus className="h-4 w-4" />
                        Add to Cart
                    </Button>
                </div>
            </CardContent>
        </Card>
        </CartProvider>
    )
}

const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex gap-6 items-start">
            <Skeleton className="w-32 h-32 rounded-lg" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-3/4" />
                <div className="space-y-1 pt-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-56" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <div className="md:col-span-2 space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, j) => (
                                <Skeleton key={j} className="h-36" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)