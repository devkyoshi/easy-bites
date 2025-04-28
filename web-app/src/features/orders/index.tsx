import { Header } from "@/components/layout/header.tsx";
import { ThemeSwitch } from "@/components/theme-switch.tsx";
import { ProfileDropdown } from "@/components/profile-dropdown.tsx";
import { OrderProvider } from "@/features/orders/context/OrderContext.tsx";
import OrdersList from "@/features/orders/details/OrderDetails.tsx";

export default function OrderPageWrapper() {

    return (
        <>
            <Header>
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">
                        Your Orders
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        All your past restaurant orders
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <OrderProvider>
                 <OrdersList />
            </OrderProvider>

        </>
    );
}