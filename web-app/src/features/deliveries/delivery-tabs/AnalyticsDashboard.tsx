// AnalyticsDashboard.tsx
import { useNavigate } from "@tanstack/react-router";
import { DeliveryLayout } from "../layouts/DeliveryLayout";
import { Card } from "@/components/ui/card";
import { IconCheck, IconClock, IconCoin, IconStar } from "@tabler/icons-react";
import { useDelivery } from "../context/delivery-context";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import { DeliverySkeleton } from "../components/DeliverySkeleton";
import { EmptyDeliveryState } from "../components/EmptyDeliveryState";
import {useEffect} from "react";

interface AnalyticsDashboardProps {
    driverId?: number;
}

export const AnalyticsDashboard = ({ driverId }: AnalyticsDashboardProps) => {
    const navigate = useNavigate();
    const { analytics, loading, error, fetchAnalyticsData } = useDelivery();

    useEffect(() => {
        if (!driverId) return;

        const controller = new AbortController();
        fetchAnalyticsData(driverId, { signal: controller.signal });

        return () => controller.abort();
    }, [driverId, fetchAnalyticsData]);

    const handleBackClick = () => {
        navigate({ to: '/deliveries' });
    };

    const completedDeliveries = analytics?.ratingDistribution.reduce((sum, item) => sum + item.count, 0) || 0;
    const totalEarnings = analytics?.weeklyStats.reduce((sum, item) => sum + item.totalEarnings, 0) || 0;

    return (
        <DeliveryLayout
            title="Delivery Analytics"
            description="View your performance metrics"
            showBackButton={true}
            onBackClick={handleBackClick}
        >
            {loading ? (
                <DeliverySkeleton context="analytics" />
            ) : error ? (
                <div className="text-red-500">Failed to load analytics</div>
            ) : !analytics || (analytics.weeklyStats.length === 0 && analytics.ratingDistribution.length === 0) ? (
                <EmptyDeliveryState context="analytics" />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <IconCheck className="h-8 w-8 text-green-500"/>
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-2xl font-bold">
                                        {completedDeliveries}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <IconCoin className="h-8 w-8 text-yellow-500"/>
                                <div>
                                    <p className="text-sm text-muted-foreground">Earnings</p>
                                    <p className="text-2xl font-bold">LKR {totalEarnings.toFixed(2)}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <IconClock className="h-8 w-8 text-blue-500"/>
                                <div>
                                    <p className="text-sm text-muted-foreground">Avg. Time</p>
                                    <p className="text-2xl font-bold">N/A</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <IconStar className="h-8 w-8 text-amber-500"/>
                                <div>
                                    <p className="text-sm text-muted-foreground">Rating</p>
                                    <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}/5</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <AnalyticsCharts analytics={analytics} />
                </>
            )}
        </DeliveryLayout>
    );
};