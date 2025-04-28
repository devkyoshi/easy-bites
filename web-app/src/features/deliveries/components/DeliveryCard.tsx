import { StatusBadge } from "./StatusBadge";
import { IconMapPin, IconCoin } from "@tabler/icons-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button.tsx";

interface DeliveryCardProps {
    delivery: {
        id: number;
        status: string;
        createdAt: string;
        order: {
            restaurantName: string;
            totalAmount: number;
            deliveryAddress: string;
        };
    };
    onViewDetails: () => void;
}

type Status =
    'PENDING' |
    'RESTAURANT_ACCEPTED' |
    'DRIVER_ASSIGNED' |
    'DELIVERED' |
    'DELIVERY_FAILED';

const isValidStatus = (status: string): status is Status => {
    return ['PENDING', 'RESTAURANT_ACCEPTED', 'DRIVER_ASSIGNED', 'DELIVERED', 'DELIVERY_FAILED'].includes(status);
};

export const DeliveryCard = ({ delivery, onViewDetails }: DeliveryCardProps) => {
    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium text-lg">{delivery.order.restaurantName}</h3>
                    <p className="text-sm text-gray-500">
                        {format(new Date(delivery.createdAt), 'MMM dd, yyyy hh:mm a')}
                    </p>
                </div>
                {isValidStatus(delivery.status) ? (
                    <StatusBadge status={delivery.status} />
                ) : (
                    <div className="text-red-500 text-xs">Unknown Status</div>
                )}
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                    <IconMapPin className="h-4 w-4 mr-2" />
                    <span>{delivery.order.deliveryAddress}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <IconCoin className="h-4 w-4 mr-2" />
                    <span>LKR {delivery.order.totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full mt-4"
                onClick={onViewDetails}
            >
                View Details
            </Button>
        </div>
    );
};