import {
  IconBrowserCheck,
  IconBuildingStore,
  IconTruckDelivery,
  IconChecklist,
  IconHelp,
  IconLayoutDashboard,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import {NavItem, type SidebarData} from '../types.ts'
import {USER_TYPES} from "@/config/user-types.ts";

export const getSidebarData = (userRole?: string): SidebarData => ({
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        // Common items for all roles
        ...(userRole === USER_TYPES.ROLE_CUSTOMER ? [{
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
          {
            title: 'Restaurants',
            url: '/restaurants',
            icon: IconBuildingStore,
          } ,{
            title: 'Deliveries',
            url: '/deliveries',
            icon: IconBuildingStore,
          }
          ,{
            title: 'My Orders',
            url: '/orders',
            icon: IconPackages,
          } as NavItem] : []),

        //Restaurant Admin specific items
        ...(userRole === USER_TYPES.ROLE_RESTAURANT_MANAGER ? [{
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
          {
            title: 'Restaurant Management',
            url: '/restaurants/restaurant-management',
            icon: IconBuildingStore,
          } as NavItem] : []),

        ...(userRole === USER_TYPES.ROLE_DELIVERY_PERSON ? [{
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
          {
            title: 'Delivery Dashboard',
            url: '/deliveries',
            icon: IconTruckDelivery,
          } as NavItem] : []),

        // System Admin specific items
        ...(userRole === USER_TYPES.ROLE_SYSTEM_ADMIN ? [
          {
            title: 'Tasks',
            url: '/tasks',
            icon: IconChecklist,
          },
          {
            title: 'Apps',
            url: '/apps',
            icon: IconPackages,
          },
          {
            title: 'Chats',
            url: '/chats',
            badge: '3',
            icon: IconMessages,
          },
          {
            title: 'Users',
            url: '/users',
            icon: IconUsers,
          }
        ] : []),
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