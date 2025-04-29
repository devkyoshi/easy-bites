import {DriverDashboardIcons} from "@/features/deliveries/components/DriverDashboardIcons.tsx";

interface EmptyStateProps {
    title: string;
    description: string;
    icon: keyof typeof DriverDashboardIcons;
    action?: React.ReactNode;
}

export function EmptyDriverState({ title, description, icon, action }: EmptyStateProps) {
    const Icon = DriverDashboardIcons[icon];

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{description}</p>
            {action}
        </div>
    );
}