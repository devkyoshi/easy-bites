import {
  IconBrowserCheck,
  IconBuildingStore,
  IconTruckDelivery,
  IconHelp,
  IconNotification,
  IconPackages,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { USER_TYPES } from '@/config/user-types.ts'
import { NavItem, type SidebarData } from '../types.ts'

export const getSidebarData = (userRole?: string): SidebarData => ({
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navGroups: [
    {
      title: 'General',
      items: [
        // Common items for all roles
        ...(userRole === USER_TYPES.ROLE_CUSTOMER
          ? [
              {
                title: 'Restaurants',
                url: '/restaurants',
                icon: IconBuildingStore,
              },
              {
                title: 'My Orders',
                url: '/orders',
                icon: IconPackages,
              } as NavItem,
            ]
          : []),

        //Restaurant Admin specific items
        ...(userRole === USER_TYPES.ROLE_RESTAURANT_MANAGER
          ? [
              {
                title: 'Restaurant Management',
                url: '/restaurants/restaurant-management',
                icon: IconBuildingStore,
              } as NavItem,
              {
                title: 'Order Requests',
                url: '/restaurants/restaurant-orders',
                icon: IconBuildingStore,
              } as NavItem,
            ]
          : []),
        ...(userRole === USER_TYPES.ROLE_DELIVERY_PERSON ? [
          {
            title: 'Delivery Dashboard',
            url: '/deliveries',
            icon: IconTruckDelivery,
          } as NavItem] : []),

        // System Admin specific items
        ...(userRole === USER_TYPES.ROLE_SYSTEM_ADMIN
          ? [
              {
                title: 'Users',
                url: '/users',
                icon: IconUsers,
              },
            ]
          : []),
      ].filter(Boolean) as NavItem[],
    },

    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
        {
          title: 'Feedback',
          url: '/tasks',
          icon: IconHelp,
        },
      ],
    },
  ],
})
