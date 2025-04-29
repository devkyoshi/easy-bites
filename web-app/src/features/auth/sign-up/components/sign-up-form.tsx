// sign-up-form.tsx
import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { IUserRegistration, registerUser } from '@/services/auth-service.ts'
import { Loader2, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils.ts'
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

const formSchema = z
  .object({
    firstName: z.string().min(1, 'Required').max(50),
    lastName: z.string().min(1, 'Required').max(50),
    email: z.string().email('Invalid email'),
    phoneNumber: z.string().min(10, 'Invalid phone number'),
    username: z
      .string()
      .min(1, 'Required')
      .max(20, 'Username must be 20 characters or less')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only alphanumeric characters and underscores'),
    password: z
      .string()
      .min(8, 'Minimum 8 characters')
      .regex(/[A-Z]/, 'At least one uppercase letter')
      .regex(/[0-9]/, 'At least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  })

  const steps = [
    {
      title: 'Personal Information',
      fields: ['firstName', 'lastName', 'email', 'phoneNumber'],
    },
    {
      title: 'Account Details',
      fields: ['username', 'password', 'confirmPassword'],
    },
  ]

  async function handleNext() {
    const fields = steps[currentStep - 1].fields
    const isValid = await form.trigger(fields as any)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  function handlePrev() {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await registerUser(values as unknown as IUserRegistration)
      navigate({ to: '/sign-in' }).then()
    } catch (error) {
      if (error instanceof Error) {
        form.setError('root', { message: error.message })
      }
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
        <div className='mb-8 flex items-center justify-center gap-2'>
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-all ${
                currentStep > index ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {form.formState.errors.root && (
          <div className='rounded-lg bg-red-50 p-3 text-sm text-red-600'>
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className='animate-fade-in space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {steps[0].title}
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>First name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='John'
                        className='focus:ring-primary focus:border-primary'
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>Last name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Doe'
                        className='focus:ring-primary focus:border-primary'
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      placeholder='john@example.com'
                      className='focus:ring-primary focus:border-primary'
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Phone number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='+1 234 567 890'
                      className='focus:ring-primary focus:border-primary'
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 2: Account Details */}
        {currentStep === 2 && (
          <div className='animate-fade-in space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {steps[1].title}
            </h3>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      placeholder='john_doe'
                      className='focus:ring-primary focus:border-primary'
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder='••••••••'
                        className='focus:ring-primary focus:border-primary'
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder='••••••••'
                        className='focus:ring-primary focus:border-primary'
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <div className='flex items-center justify-between gap-4'>
          {currentStep > 1 && (
            <Button
              type='button'
              variant='outline'
              className='gap-1'
              onClick={handlePrev}
              disabled={isLoading}
            >
              <ChevronLeft className='h-4 w-4' />
              Back
            </Button>
          )}

          {currentStep < steps.length ? (
            <Button
              type='button'
              className='bg-primary hover:bg-primary-dark ml-auto w-32 font-semibold'
              onClick={handleNext}
              disabled={isLoading}
            >
              Proceed
            </Button>
          ) : (
            <Button
              type='submit'
              className='bg-primary hover:bg-primary-dark ml-auto w-32 font-semibold'
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                'Create Account'
              )}
            </Button>
          )}
        </div>

        {currentStep === 1 && (
          <>
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
            </div>
          </>
        )}
      </form>
    </Form>
  )
}
