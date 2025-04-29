import { Skeleton } from "@/components/ui/skeleton";

interface DeliverySkeletonProps {
    context?: "dashboard" | "history" | "analytics" | "details";
}

export const DeliverySkeleton = ({ context = "dashboard" }: DeliverySkeletonProps) => {
    const loadingMessages = {
        dashboard: "Loading your delivery dashboard...",
        history: "Fetching your delivery history...",
        analytics: "Crunching the numbers...",
        details: "Getting delivery details..."
    };

    return (
        <div className="space-y-4">
            <p className="text-muted-foreground text-sm animate-pulse">
                {loadingMessages[context]}
            </p>
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/2" />
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        </div>
    );
};