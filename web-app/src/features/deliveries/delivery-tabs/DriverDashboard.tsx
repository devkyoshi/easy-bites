import { useNavigate } from "@tanstack/react-router";
import { DeliveryLayout } from "../layouts/DeliveryLayout";
import { DashboardOverview } from "../components/DashboardOverview";
import { ActiveDeliveries } from "../components/ActiveDelivery";
import { DeliveryHistory } from "../components/DeliveryHistory";
import { Button } from "@/components/ui/button";
import { useDelivery } from "../context/delivery-context";
import { DeliverySkeleton } from "../components/DeliverySkeleton";
import {Alert, AlertDescription} from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { EmptyDriverState } from "../components/EmptyDriverState";
import {useEffect} from "react";
import {DriverProfile} from "@/features/deliveries/components/DriverProfile.tsx";
import axios from "axios";

interface DriverDashboardProps {
    driverId: number;
}

export function DriverDashboard({ driverId }: DriverDashboardProps) {
    const navigate = useNavigate();
    const {
        activeDelivery,
        socketCleanup,
        error,
        loading,
        deliveryHistory,
        analytics,
        initializeDriver,
        fetchDeliveryHistory,
    } = useDelivery();

    useEffect(() => {
        const abortController = new AbortController();
        let mounted = true;

        const init = async () => {
            try {
                await initializeDriver(driverId, undefined, {
                    signal: abortController.signal
                });

                if (mounted) {
                    await fetchDeliveryHistory(driverId, {
                        signal: abortController.signal
                    });
                }
            } catch (error) {
                if (!axios.isCancel(error) && mounted) {
                    console.error("Initialization failed:", error);
                }
            }
        };

        init();

        return () => {
            mounted = false;
            abortController.abort();
            socketCleanup?.();
        };
    }, [driverId]);

    const handleNavigateToAnalyticPage = () => {
        navigate({ to: '/deliveries/driver-analytics' });
    };

    return (
        <DeliveryLayout
            title="Delivery Dashboard"
            description="Manage your deliveries and track orders"
            showAnalyticsButton={true}
            onAnalyticsClick={handleNavigateToAnalyticPage}
        >
            {loading ? (
                <DeliverySkeleton context="dashboard" />
            ) : error ? (
                <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load dashboard data. Please try again later.
                    </AlertDescription>
                </Alert>
            ) : (
                <>
                    {/*<div className="flex justify-end mb-6">*/}
                    {/*    <Button*/}
                    {/*        variant="outline"*/}
                    {/*        onClick={handleNavigateToAnalyticPage}*/}
                    {/*        className="gap-2"*/}
                    {/*    >*/}
                    {/*        <span>View Analytics</span>*/}
                    {/*        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">*/}
                    {/*            <path d="M3 3v18h18" />*/}
                    {/*            <path d="m19 9-5 5-4-4-3 3" />*/}
                    {/*        </svg>*/}
                    {/*    </Button>*/}
                    {/*</div>*/}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <DriverProfile driverId={driverId} />
                        </div>

                        {analytics ? (
                            <DashboardOverview driverId={driverId} />
                        ) : (
                            <EmptyDriverState
                                title="No Statistics Available"
                                description="We couldn't find any delivery statistics for your account"
                                icon="chart"
                            />
                        )}

                        {activeDelivery ? (
                            <ActiveDeliveries driverId={driverId} />
                        ) : (
                            <EmptyDriverState
                                title="No Active Deliveries"
                                description="You don't have any active deliveries at the moment"
                                icon="package"
                                action={
                                    <Button variant="outline" onClick={() => window.location.reload()}>
                                        Check for New Deliveries
                                    </Button>
                                }
                            />
                        )}

                        {deliveryHistory && deliveryHistory.length > 0 ? (
                            <DeliveryHistory driverId={driverId} />
                        ) : (
                            <EmptyDriverState
                                title="No Delivery History"
                                description="Your completed deliveries will appear here"
                                icon="history"
                            />
                        )}
                    </div>
                </>
            )}
        </DeliveryLayout>
    );
}