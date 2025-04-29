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
import axios from "axios";
import {useAuth} from "@/stores/auth-context.tsx";

interface AnalyticsDashboardProps {
    driverId?: number;
}

export const AnalyticsDashboard = ({ driverId }: AnalyticsDashboardProps) => {
    const navigate = useNavigate();
    const { analytics, loading, error, fetchAnalyticsData } = useDelivery();
    const {currentUser} = useAuth();

    useEffect(() => {
        const id = currentUser?.userId;
        if (!id) return; // Don't log the error—just wait for driver data to load

        const controller = new AbortController();
        fetchAnalyticsData(id, { signal: controller.signal }).catch(e => {
            if (!axios.isCancel(e)) {
                console.error("Failed to fetch analytics", e);
            }
        });

        return () => controller.abort();
    }, [currentUser?.userId]);

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
                        <Card className="p-4 flex-1 min-w-[200px]">
                            <div className="flex items-center gap-4 h-full">
                                <div className="p-2 rounded-full bg-green-100">
                                    <IconCheck className="h-6 w-6 text-green-600"/>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-2xl font-bold">
                                        {completedDeliveries}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 flex-1 min-w-[200px]">
                            <div className="flex items-center gap-4 h-full">
                                <div className="p-2 rounded-full bg-yellow-100">
                                    <IconCoin className="h-6 w-6 text-yellow-600"/>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Earnings</p>
                                    <p className="text-2xl font-bold">LKR {totalEarnings.toFixed(2)}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 flex-1 min-w-[200px]">
                            <div className="flex items-center gap-4 h-full">
                                <div className="p-2 rounded-full bg-blue-100">
                                    <IconClock className="h-6 w-6 text-blue-600"/>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">AVG. TIME</p>
                                    <p className="text-2xl font-bold">N/A</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 flex-1 min-w-[200px]">
                            <div className="flex items-center gap-4 h-full">
                                <div className="p-2 rounded-full bg-amber-100">
                                    <IconStar className="h-6 w-6 text-amber-600"/>
                                </div>
                                <div className="flex-1">
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