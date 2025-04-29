import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import {
  IRestaurantCreateDetails,
  createRestaurant,
} from '@/services/restaurant-service'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth-context.tsx'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const daysOptions = [
  { label: 'Monday', value: 'MONDAY' },
  { label: 'Tuesday', value: 'TUESDAY' },
  { label: 'Wednesday', value: 'WEDNESDAY' },
  { label: 'Thursday', value: 'THURSDAY' },
  { label: 'Friday', value: 'FRIDAY' },
  { label: 'Saturday', value: 'SATURDAY' },
] as const

interface RestaurantFormValues {
  name: string
  description: string
  address: string
  phone: string
  email: string
  logoUrl: string
  isOpen: boolean
  openingHour: string
  closingHour: string
  daysOpen: string[]
}

export function RestaurantRegistration() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const form = useForm<RestaurantFormValues>({
    defaultValues: {
      isOpen: true,
      daysOpen: [],
      openingHour: '08:00',
      closingHour: '22:00',
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      logoUrl: '',
    },
  })

  const steps = [
    { title: 'Basic Details', fields: ['name', 'description', 'logoUrl'] },
    {
      title: 'Contact & Hours',
      fields: ['address', 'phone', 'email', 'openingHour', 'closingHour'],
    },
    { title: 'Final Settings', fields: ['daysOpen', 'isOpen'] },
  ]

  const handleNext = async () => {
    const fields = steps[currentStep - 1].fields
    const isValid = await form.trigger(fields as any)
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  async function onSubmit(values: RestaurantFormValues) {
    if (!currentUser?.userId) {
      toast.error('Authentication required')
      return
    }

    const restaurantData: IRestaurantCreateDetails = {
      ...values,
      managerId: currentUser.userId,
      daysOpen: values.daysOpen,
    }

    try {
      await createRestaurant(restaurantData)
      toast.success('Restaurant registered successfully!')
      navigate({ to: '/restaurants/restaurant-management' }).then()
    } catch (error) {
      toast.error('Failed to create restaurant. Please try again.')
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <div className='flex flex-col items-center space-y-2'>
            <CardTitle className='text-2xl font-bold text-gray-900'>
              Register Your Restaurant
            </CardTitle>
            <div className='flex space-x-2'>
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    currentStep > index ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className='mt-2 text-center text-gray-600'>
            Step {currentStep} of {steps.length}
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Step 1: Basic Details */}
              {currentStep === 1 && (
                <div className='animate-fade-in space-y-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='The Golden Fork'
                            {...field}
                            required
                            minLength={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Describe your restaurant...'
                            className='min-h-[100px]'
                            {...field}
                            required
                            minLength={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='logoUrl'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='https://example.com/logo.jpg'
                            {...field}
                            required
                            type='url'
                          />
                        </FormControl>
                        <FormDescription>
                          Direct link to your restaurant logo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Contact & Hours */}
              {currentStep === 2 && (
                <div className='animate-fade-in space-y-4'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='123 Main Street, City'
                              {...field}
                              required
                              minLength={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='+1 234 567 890'
                              {...field}
                              required
                              minLength={10}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='contact@restaurant.com'
                              {...field}
                              required
                              type='email'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='openingHour'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Time</FormLabel>
                          <FormControl>
                            <Input
                              type='time'
                              {...field}
                              required
                              pattern='\d{2}:\d{2}'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='closingHour'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Closing Time</FormLabel>
                          <FormControl>
                            <Input
                              type='time'
                              {...field}
                              required
                              pattern='\d{2}:\d{2}'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Final Settings */}
              {currentStep === 3 && (
                <div className='animate-fade-in space-y-4'>
                  <FormField
                    control={form.control}
                    name='daysOpen'
                    render={({ field }) => (
                      <FormItem>
                        <div className='mb-4'>
                          <FormLabel className='text-base'>
                            Operating Days
                          </FormLabel>
                          <FormDescription>
                            Select all days your restaurant is open
                          </FormDescription>
                        </div>
                        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                          {daysOptions.map((day) => (
                            <FormItem
                              key={day.value}
                              className='flex flex-row items-start space-y-0 space-x-3'
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || []
                                    const newValues = checked
                                      ? [...currentValues, day.value]
                                      : currentValues.filter(
                                          (v) => v !== day.value
                                        )
                                    field.onChange(newValues)
                                  }}
                                  required={field.value?.length === 0}
                                />
                              </FormControl>
                              <FormLabel className='font-normal'>
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='isOpen'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            Currently Open for Business
                          </FormLabel>
                          <FormDescription>
                            Toggle your restaurant's availability
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className='flex items-center justify-between gap-4'>
                {currentStep > 1 && (
                  <Button
                    type='button'
                    variant='outline'
                    className='gap-1'
                    onClick={handlePrev}
                  >
                    <ChevronLeft className='h-4 w-4' />
                    Back
                  </Button>
                )}

                {currentStep < steps.length ? (
                  <Button
                    type='button'
                    className='ml-auto w-32'
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type='submit' className='ml-auto w-32'>
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
