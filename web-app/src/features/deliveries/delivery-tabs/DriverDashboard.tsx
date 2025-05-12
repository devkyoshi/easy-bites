import { useNavigate } from "@tanstack/react-router";
import { DeliveryLayout } from "../layouts/DeliveryLayout";
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
import {NearbyDeliveries} from "@/features/deliveries/components/NearbyDeliveries.tsx";

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
        initializeDriver,
        fetchDeliveryHistory,
        refreshData,
        driver,
    } = useDelivery();

    useEffect(() => {
        const abortController = new AbortController();
        let mounted = true;

        const init = async () => {
            try {
                console.log("Initializing Driver", driverId);
                await initializeDriver(driverId, undefined, {
                    signal: abortController.signal
                });

                console.log("initializing", driver);

                if (mounted) {
                    // Fetch all data in parallel
                    await Promise.all([
                        fetchDeliveryHistory(driverId, {
                            signal: abortController.signal
                        }),
                        refreshData(), // This will fetch active delivery and analytics
                    ]);
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
            ) : (error || !driver) ? (
                <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertDescription>
                        {error || "Failed to initialize driver connection"}
                    </AlertDescription>
                </Alert>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <DriverProfile driverId={driverId} />
                        </div>

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

                        <NearbyDeliveries />

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

// import { useNavigate } from "@tanstack/react-router";
// import { DeliveryLayout } from "../layouts/DeliveryLayout";
// import { ActiveDeliveries } from "../components/ActiveDelivery";
// import { DeliveryHistory } from "../components/DeliveryHistory";
// import { Button } from "@/components/ui/button";
// import { useDelivery } from "../context/delivery-context";
// import { DeliverySkeleton } from "../components/DeliverySkeleton";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
// import { EmptyDriverState } from "../components/EmptyDriverState";
// import { useEffect } from "react";
// import { DriverProfile } from "@/features/deliveries/components/DriverProfile.tsx";
// import axios from "axios";
// import { NearbyDeliveries } from "@/features/deliveries/components/NearbyDeliveries.tsx";
// import { toast } from "sonner";
//
// interface DriverDashboardProps {
//     driverId: number;
// }
//
// export function DriverDashboard({ driverId }: DriverDashboardProps) {
//     const navigate = useNavigate();
//     const {
//         activeDelivery,
//         error,
//         loading,
//         deliveryHistory,
//         initializeDriver,
//         fetchDeliveryHistory,
//         refreshData,
//         driver,
//         cleanupPolling,
//     } = useDelivery();
//
//     useEffect(() => {
//         const abortController = new AbortController();
//         let mounted = true;
//
//         const init = async () => {
//             try {
//                 console.log("Initializing Driver", driverId);
//                 await initializeDriver(driverId, undefined, {
//                     signal: abortController.signal
//                 });
//
//                 if (mounted) {
//                     // Fetch all data in parallel
//                     await Promise.all([
//                         fetchDeliveryHistory(driverId, {
//                             signal: abortController.signal
//                         }).catch(error => {
//                             if (!axios.isCancel(error)) {
//                                 console.error("Failed to fetch delivery history:", error);
//                                 toast.error("Failed to load delivery history");
//                             }
//                         }),
//                         refreshData({
//                             signal: abortController.signal
//                         }).catch(error => {
//                             if (!axios.isCancel(error)) {
//                                 console.error("Failed to refresh data:", error);
//                                 toast.error("Failed to load dashboard data");
//                             }
//                         }),
//                     ]);
//                 }
//             } catch (error) {
//                 if (!axios.isCancel(error) && mounted) {
//                     console.error("Initialization failed:", error);
//                     toast.error("Failed to initialize driver");
//                 }
//             }
//         };
//
//         init();
//
//         return () => {
//             mounted = false;
//             abortController.abort();
//             cleanupPolling?.();
//         };
//     }, [driverId, initializeDriver, fetchDeliveryHistory, refreshData, cleanupPolling]);
//
//     const handleNavigateToAnalyticPage = () => {
//         navigate({ to: '/deliveries/driver-analytics' });
//     };
//
//     const handleRefresh = async () => {
//         try {
//             await refreshData();
//             await fetchDeliveryHistory(driverId);
//             toast.success("Data refreshed successfully");
//         } catch (error) {
//             console.error("Refresh failed:", error);
//             toast.error("Failed to refresh data");
//         }
//     };
//
//     return (
//         <DeliveryLayout
//             title="Delivery Dashboard"
//             description="Manage your deliveries and track orders"
//             showAnalyticsButton={true}
//             onAnalyticsClick={handleNavigateToAnalyticPage}
//         >
//             {loading ? (
//                 <DeliverySkeleton context="dashboard" />
//             ) : (error || !driver) ? (
//                 <Alert variant="destructive">
//                     <ExclamationTriangleIcon className="h-4 w-4" />
//                     <AlertDescription>
//                         {error || "Failed to initialize driver connection"}
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="ml-2"
//                             onClick={handleRefresh}
//                         >
//                             Retry
//                         </Button>
//                     </AlertDescription>
//                 </Alert>
//             ) : (
//                 <>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div className="md:col-span-2">
//                             <DriverProfile driverId={driverId} />
//                         </div>
//
//                         {activeDelivery ? (
//                             <ActiveDeliveries driverId={driverId} />
//                         ) : (
//                             <EmptyDriverState
//                                 title="No Active Deliveries"
//                                 description="You don't have any active deliveries at the moment"
//                                 icon="package"
//                                 action={
//                                     <Button variant="outline" onClick={handleRefresh}>
//                                         Check for New Deliveries
//                                     </Button>
//                                 }
//                             />
//                         )}
//
//                         <NearbyDeliveries />
//
//                         {deliveryHistory && deliveryHistory.length > 0 ? (
//                             <DeliveryHistory driverId={driverId} />
//                         ) : (
//                             <EmptyDriverState
//                                 title="No Delivery History"
//                                 description="Your completed deliveries will appear here"
//                                 icon="history"
//                             />
//                         )}
//                     </div>
//                 </>
//             )}
//         </DeliveryLayout>
//     );
// }