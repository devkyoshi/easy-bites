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
        if (!currentUser || !currentUser.userId) {
            toast.error("Please sign in to access this page");
            navigate({ to: '/' });
        }
    }, [currentUser, navigate]);

    if (!currentUser || !currentUser.userId) {
        return null;
    }

    return (
        <DeliveryProvider>
            <DeliveryContent driverId={currentUser.userId} role={currentUser.role} />
        </DeliveryProvider>
    );
}
