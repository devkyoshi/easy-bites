interface EmptyStateProps {
    context?: "dashboard" | "history" | "analytics" | "details";
}

export const EmptyDeliveryState = ({ context = "dashboard" }: EmptyStateProps) => {
    const messages = {
        dashboard: "No deliveries at the moment",
        history: "No delivery history yet",
        analytics: "No analytics data available",
        details: "Couldn't load delivery details"
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-muted rounded-full mb-4" />
            <h3 className="text-lg font-medium">Nothing to show here</h3>
            <p className="text-muted-foreground text-sm">
                {messages[context]}
            </p>
        </div>
    );
};