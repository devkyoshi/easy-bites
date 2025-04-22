import {Header} from "@/components/layout/header.tsx";
import {TopNav} from "@/components/layout/top-nav.tsx";
import {ThemeSwitch} from "@/components/theme-switch.tsx";
import {ProfileDropdown} from "@/components/profile-dropdown.tsx";

import {FoodItemProvider} from "@/features/restaurants/context/fooditem-context.tsx";
import {MenuCategoryContent} from "@/features/restaurants/admin/restaurant-category-content.tsx";

export const CategoryTab = () => {
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
               <MenuCategoryContent/>
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