import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('ROLE_SYSTEM_ADMIN'),
  z.literal('ROLE_RESTAURANT_MANAGER'),
  z.literal('ROLE_DELIVERY_PERSON'),
  z.literal('ROLE_ORDER_MANAGER'),
  z.literal('ROLE_CUSTOMER'),
  z.literal('UNKNOWN'),
])

const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
