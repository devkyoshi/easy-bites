import { Header } from "@/components/layout/header.tsx";
import { ThemeSwitch } from "@/components/theme-switch.tsx";
import { ProfileDropdown } from "@/components/profile-dropdown.tsx";
import { OrderProvider } from "@/features/orders/context/OrderContext.tsx";
import { useParams } from "react-router-dom";
import OrdersList from "@/features/orders/details/OrderDetails.tsx";
import OrderDetailsPage from "@/features/orders/details/OrderDetailsPage.tsx";

export default function OrderPageWrapper() {
    const { orderId } = useParams();

    return (
        <>
            <Header>
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">
                        {orderId ? `Order #${orderId}` : "Your Orders"}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {orderId ? "Order details and tracking" : "All your past restaurant orders"}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <OrderProvider>
                {orderId ? <OrderDetailsPage /> : <OrdersList />}
            </OrderProvider>
        </>
    );
}