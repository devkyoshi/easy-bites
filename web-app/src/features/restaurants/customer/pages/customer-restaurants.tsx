import { Header } from '@/components/layout/header.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { RestaurantProvider } from '@/features/restaurants/context/restaurant-context.tsx'
import { Cart } from '@/features/restaurants/customer/components/cart.tsx'
import { RestaurantPageContent } from '@/features/restaurants/customer/components/restaurant-page-content.tsx'

export default function CustomerRestaurantsTab() {
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
          <Cart />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <RestaurantProvider>
        <RestaurantPageContent />
      </RestaurantProvider>
    </>
  )
}
