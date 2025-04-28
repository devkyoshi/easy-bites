import { DeliveryProvider } from "@/features/deliveries/context/delivery-context";
import { useAuth } from "@/stores/auth-context";
import { DeliveryContent } from "@/features/deliveries/components/DeliveryContent.tsx";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export default function DeliveryTab() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            toast.error("User not authenticated.");
            navigate({ to: '/' });
        } else if (currentUser.role !== 'ROLE_DELIVERY_PERSON') {
            toast.error("Access restricted to delivery personnel only.");
            navigate({ to: '/' });
        } else if (!currentUser.userId) {
            toast.error("Invalid user data. Please sign in again.");
            navigate({ to: '/' });
        }
    }, [currentUser, navigate]);

    if (!currentUser || currentUser.role !== 'ROLE_DELIVERY_PERSON' || !currentUser.userId) {
        return null;
    }

    return (
        <DeliveryProvider>
            <DeliveryContent driverId={currentUser.userId} />
        </DeliveryProvider>
    );
}
