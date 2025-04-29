import { cn } from "@/lib/utils";

type Status =
    'PENDING' |
    'RESTAURANT_ACCEPTED' |
    'DRIVER_ASSIGNED' |
    'DELIVERED' |
    'DELIVERY_FAILED';

interface StatusBadgeProps {
    status: Status;
    className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
    const statusConfig = {
        PENDING: {
            text: 'Pending',
            bg: 'bg-yellow-100',
            textColor: 'text-yellow-800'
        },
        RESTAURANT_ACCEPTED: {
            text: 'Restaurant Accepted',
            bg: 'bg-blue-100',
            textColor: 'text-blue-800'
        },
        DRIVER_ASSIGNED: {
            text: 'On the Way',
            bg: 'bg-purple-100',
            textColor: 'text-purple-800'
        },
        DELIVERED: {
            text: 'Delivered',
            bg: 'bg-green-100',
            textColor: 'text-green-800'
        },
        DELIVERY_FAILED: {
            text: 'Delivery Failed',
            bg: 'bg-red-100',
            textColor: 'text-red-800'
        }
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                statusConfig[status].bg,
                statusConfig[status].textColor,
                className
            )}
        >
      {statusConfig[status].text}
    </span>
    );
};