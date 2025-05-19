import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'
import { UserStatus } from './schema.ts'

export const callTypes = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const userTypes = [
  {
    label: 'Superadmin',
    value: 'SYSTEM_ADMIN',
    icon: IconShield,
  },
  {
    label: 'Admin',
    value: 'SYSTEM_ADMIN',
    icon: IconUserShield,
  },
  {
    label: 'Restaurant Manager',
    value: 'RESTAURANT_MANAGER',
    icon: IconUsersGroup,
  },
  {
    label: 'Delivery Person',
    value: 'DELIVERY_PERSON',
    icon: IconCash,
  },
  {
    label: 'Customer',
    value: 'CUSTOMER',
    icon: IconCash,
  },
] as const
