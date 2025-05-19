import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { USER_TYPES } from '@/config/user-types.ts'
import { LoginRequest } from '@/services/auth-service.ts'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth-context.tsx'
import { cn } from '@/lib/utils.ts'
import { formatBackendMessage } from '@/utils/server-msg-utils.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { PasswordInput } from '@/components/password-input.tsx'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Please enter your username' })
    .min(3, { message: 'Username must be at least 3 characters long' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(7, { message: 'Password must be at least 7 characters long' }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const creds: LoginRequest = {
        username: data.username,
        password: data.password,
      }
      const loggedUser = await signIn(creds)

      toast.success('Logged in successfully!', {
        duration: 2000,
        position: 'top-center',
      })

      if (loggedUser?.role === USER_TYPES.ROLE_CUSTOMER) {
        navigate({ to: '/restaurants' }).then()
        return
      }

      if (loggedUser?.role === USER_TYPES.ROLE_RESTAURANT_MANAGER) {
        navigate({ to: '/restaurants/restaurant-management' }).then()
        return
      }

      if (loggedUser?.role === USER_TYPES.ROLE_SYSTEM_ADMIN) {
        navigate({ to: '/users' }).then()
        return
      }

      if (loggedUser?.role === USER_TYPES.ROLE_DELIVERY_PERSON) {
        navigate({ to: '/deliveries' }).then()
        return
      }
    } catch (err: any) {
      toast.error(
        formatBackendMessage(err.message as string) || 'Login failed',
        {
          duration: 5000,
          position: 'top-center',
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-gray-700'>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder='your_username'
                  {...field}
                  className='focus:ring-primary focus:border-primary'
                />
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel className='text-gray-700'>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='********'
                  {...field}
                  className='focus:ring-primary focus:border-primary'
                />
              </FormControl>
              <FormMessage className='text-xs' />
              <Link
                to='/forgot-password'
                className='text-primary absolute -top-0.5 right-0 text-sm font-medium hover:underline'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='bg-primary hover:bg-primary-dark w-full font-semibold'
          disabled={isLoading}
        >
          {isLoading ? 'Logging in…' : 'Login'}
        </Button>

        <div className='relative my-4'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
        </div>
      </form>
    </Form>
  )
}
