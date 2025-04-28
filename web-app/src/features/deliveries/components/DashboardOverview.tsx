import { Card } from "@/components/ui/card";
import { IconCheck, IconClock, IconCoin, IconStar } from "@tabler/icons-react";
import { useDelivery } from "@/features/deliveries/context/delivery-context";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardOverview = ({ driverId }: { driverId: number }) => {
    const { analytics, loading } = useDelivery();

    if (loading || !analytics) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                        <IconCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold">
                            {analytics.weeklyStats.reduce((acc, curr) => acc + curr.deliveryCount, 0)}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-yellow-100 rounded-full">
                        <IconCoin className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Earnings</p>
                        <p className="text-2xl font-bold">
                            LKR {analytics.weeklyStats.reduce((acc, curr) => acc + curr.totalEarnings, 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                        <IconClock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Avg. Time</p>
                        <p className="text-2xl font-bold">-- mins</p>
                    </div>
                </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-100 rounded-full">
                        <IconStar className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="text-2xl font-bold">
                            {analytics.averageRating?.toFixed(1) || '--'}/5
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};