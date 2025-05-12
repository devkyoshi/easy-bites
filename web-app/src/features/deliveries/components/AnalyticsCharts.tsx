import { LineChart } from "@/components/ui/charts/LineChart";
import { BarChart } from "@/components/ui/charts/BarChart";
import { Card } from "@/components/ui/card";
import { IDeliveryAnalytics } from "@/services/types/delivery.type.ts";

export const AnalyticsCharts = ({ analytics }: { analytics: IDeliveryAnalytics }) => {
    // Format data for LineChart (Weekly Deliveries)
    const lineChartData = {
        labels: analytics?.weeklyStats?.map(item => item.day),
        datasets: [
            {
                label: 'Deliveries',
                data: analytics?.weeklyStats?.map(item => item.deliveryCount),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            }
        ]
    };

    // Format data for BarChart (Rating Distribution)
    const barChartData = {
        labels: analytics.ratingDistribution.map(item => `${item.rating} Star`),
        datasets: [
            {
                label: 'Count',
                data: analytics.ratingDistribution.map(item => item.count),
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
            }
        ]
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="p-4">
                <h4 className="font-medium mb-4">Weekly Deliveries</h4>
                <LineChart
                    data={lineChartData}
                    className="h-[300px]"
                />
            </Card>

            <Card className="p-4">
                <h4 className="font-medium mb-4">Rating Distribution</h4>
                <BarChart
                    data={barChartData}
                    className="h-[300px]"
                />
            </Card>
        </div>
    );
};