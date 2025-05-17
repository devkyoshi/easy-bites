import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import {
  registerRestaurantManager,
  registerDeliveryPerson,
  getVehicleTypes,
} from '@/services/staff-service.ts'
import { Loader2, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
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
    role: z.enum(['RESTAURANT_MANAGER', 'DELIVERY_PERSON']),
    firstName: z.string().min(1, 'Required').max(50),
    lastName: z.string().min(1, 'Required').max(50),
    email: z.string().email('Invalid email'),
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
    licenseNumber: z.string().optional(),
    vehicleType: z.enum(['BIKE', 'CAR', 'VAN', 'THREE_WHEELER']).optional(),
    vehicleNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (
        data.role === 'RESTAURANT_MANAGER' ||
        data.role === 'DELIVERY_PERSON'
      ) {
        return !!data.licenseNumber?.trim()
      }
      return true
    },
    {
      message: 'License number is required',
      path: ['licenseNumber'],
    }
  )
  .refine(
    (data) => {
      if (data.role === 'DELIVERY_PERSON') {
        return !!data.vehicleType
      }
      return true
    },
    {
      message: 'Vehicle type is required for delivery persons',
      path: ['vehicleType'],
    }
  )
  .refine(
    (data) => {
      if (data.role === 'DELIVERY_PERSON') {
        return !!data.vehicleNumber?.trim()
      }
      return true
    },
    {
      message: 'Vehicle number is required for delivery persons',
      path: ['vehicleNumber'],
    }
  )

export const StaffRegistrationPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'RESTAURANT_MANAGER',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      licenseNumber: '',
      vehicleType: undefined,
      vehicleNumber: '',
    },
  })

  const steps = [
    { title: 'Select Role' },
    { title: 'Account Information' },
    { title: 'Role Details' },
  ]

  const handleNext = async () => {
    const fields =
      currentStep === 1
        ? ['role']
        : currentStep === 2
          ? ['firstName', 'lastName', 'email', 'username']
          : []

    const isValid = await form.trigger(fields as any)
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      if (values.role === 'RESTAURANT_MANAGER') {
        await registerRestaurantManager({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          username: values.username,
          userType: 'RESTAURANT_MANAGER',
          roles: ['ROLE_RESTAURANT_MANAGER'],
          licenseNumber: values.licenseNumber || '',
        })
      } else {
        await registerDeliveryPerson({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          username: values.username,
          userType: 'DELIVERY_PERSON',
          roles: ['ROLE_DELIVERY_PERSON'],
          vehicleType: values.vehicleType!,
          vehicleNumber: values.vehicleNumber!,
          licenseNumber: values.licenseNumber!,
        })
      }
      navigate({ to: '/sign-in' }).then()
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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

            {currentStep === 1 && (
              <div className='animate-fade-in space-y-6'>
                <h2 className='text-center text-2xl font-bold text-gray-900'>
                  Select Staff Role
                </h2>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Button
                    type='button'
                    variant={
                      form.watch('role') === 'RESTAURANT_MANAGER'
                        ? 'default'
                        : 'outline'
                    }
                    className='h-24 flex-col gap-2 text-lg'
                    onClick={() => form.setValue('role', 'RESTAURANT_MANAGER')}
                  >
                    🍴 Restaurant Manager
                    <span className='text-sm font-normal text-gray-600'>
                      Manage restaurant operations
                    </span>
                  </Button>
                  <Button
                    type='button'
                    variant={
                      form.watch('role') === 'DELIVERY_PERSON'
                        ? 'default'
                        : 'outline'
                    }
                    className='h-24 flex-col gap-2 text-lg'
                    onClick={() => form.setValue('role', 'DELIVERY_PERSON')}
                  >
                    🚚 Delivery Person
                    <span className='text-sm font-normal text-gray-600'>
                      Handle food deliveries
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className='animate-fade-in space-y-4'>
                <h2 className='text-center text-2xl font-bold text-gray-900'>
                  Staff Information
                </h2>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder='John' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder='Doe' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='john@example.com'
                          type='email'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='john_doe' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className='animate-fade-in space-y-4'>
                <h2 className='text-center text-2xl font-bold text-gray-900'>
                  Role Specific Information
                </h2>

                {form.watch('role') === 'RESTAURANT_MANAGER' && (
                  <FormField
                    control={form.control}
                    name='licenseNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant License Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='LIC-123456'
                            className='font-mono'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch('role') === 'DELIVERY_PERSON' && (
                  <>
                    <FormField
                      control={form.control}
                      name='vehicleType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Type</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                            >
                              <option value=''>Select vehicle type</option>
                              {getVehicleTypes().map((vehicle) => (
                                <option
                                  key={vehicle.value}
                                  value={vehicle.value}
                                >
                                  {vehicle.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='vehicleNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='ABC-1234'
                              className='font-mono'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='licenseNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver's License Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='DL-123456789'
                              className='font-mono'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} placeholder='••••••••' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} placeholder='••••••••' />
                        </FormControl>
                        <FormMessage />
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
                  Continue
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
                    'Complete Registration'
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
