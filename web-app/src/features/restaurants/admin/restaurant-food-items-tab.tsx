import {Header} from "@/components/layout/header.tsx";
import {TopNav} from "@/components/layout/top-nav.tsx";
import {ThemeSwitch} from "@/components/theme-switch.tsx";
import {ProfileDropdown} from "@/components/profile-dropdown.tsx";

import {FoodItemProvider} from "@/features/restaurants/context/fooditem-context.tsx";
import {FoodItemContent} from "@/features/restaurants/admin/food-item-content.tsx";

export const FoodItemsTab = () => {
   return (
       <>
           <Header>
               <TopNav links={topNav} />
               <div className='ml-auto flex items-center space-x-4'>
                   <ThemeSwitch />
                   <ProfileDropdown />
               </div>
           </Header>

           <FoodItemProvider>
               <FoodItemContent/>
           </FoodItemProvider>
       </>
   )
}

const topNav = [
    {
        title: 'Overview',
        href: 'dashboard/overview',
        isActive: true,
        disabled: false,
    },
    {
        title: 'Customers',
        href: 'dashboard/customers',
        isActive: false,
        disabled: true,
    },
    {
        title: 'Products',
        href: 'dashboard/products',
        isActive: false,
        disabled: true,
    },
    {
        title: 'Settings',
        href: 'dashboard/settings',
        isActive: false,
        disabled: true,
    },
]