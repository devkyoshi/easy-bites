import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    IconClock,
    IconCircleCheck,
    IconCircleX,
    IconPhoto
} from "@tabler/icons-react";
import {IRestaurant, useRestaurant} from "@/features/restaurants/context/restaurant-context.tsx";

import {useNavigate} from "@tanstack/react-router";

export const RestaurantPageContent = () => {
    const { restaurants, loading } = useRestaurant();

    const navigate = useNavigate();

    const handleNavigateToDetailPage = (restaurant: IRestaurant) => {
        navigate({
            to: '/restaurants/restaurant-details',
            state: { restaurantId: restaurant.restaurantId } as never,
        }).then();
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <Card key={index} className="p-4">
                        <Skeleton className="h-48 w-full rounded-lg mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
           {/* <h1 className="text-lg font-bold mb-6">Available Restaurants</h1>*/}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants?.map((restaurant, index) => (
                    <div key={index}>
                        <Card className="h-full overflow-hidden">
                            <div className="relative aspect-video bg-muted">
                                {restaurant.logoUrl ? (
                                    <img
                                        src={restaurant.logoUrl}
                                        alt={restaurant.name}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <IconPhoto className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                                    <div className="flex items-center gap-1">
                                        {restaurant.isOpen ? (
                                            <>
                                                <IconCircleCheck className="h-5 w-5 text-green-600" />
                                                <span className="text-sm text-green-600">Open Now</span>
                                            </>
                                        ) : (
                                            <>
                                                <IconCircleX className="h-5 w-5 text-red-600" />
                                                <span className="text-sm text-red-600">Closed</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {restaurant.description}
                                </p>

                                <Button className="w-full" variant="outline" onClick={() => handleNavigateToDetailPage(restaurant)}>
                                    View Menu
                                </Button>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            {restaurants?.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <IconClock className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Restaurants Available</h2>
                    <p className="text-muted-foreground">
                        Check back later for updates
                    </p>
                </div>
            )}
        </div>
    );
};