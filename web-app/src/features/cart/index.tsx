import { CartProvider } from "@/features/cart/context/cart-context";
import CartDetails from "@/features/cart/details/cart-details";
import {Header} from "@/components/layout/header.tsx";
import {ThemeSwitch} from "@/components/theme-switch.tsx";
import {ProfileDropdown} from "@/components/profile-dropdown.tsx";

export default function CartPageWrapper() {
    return (
        <>
            <Header>

                <div className='flex items-center gap-4'>
                    <h1 className='text-2xl font-bold'>Restaurants</h1>
                    <p className='text-muted-foreground text-sm'>
                        All restaurants in one place.
                    </p>
                </div>
                <div className='ml-auto flex items-center gap-4'>

                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

        <CartProvider>
            <CartDetails />
        </CartProvider>
        </>
    );
}
