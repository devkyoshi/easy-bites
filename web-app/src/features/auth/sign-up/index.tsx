// sign-up.tsx
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import AuthLayout from '../auth-layout.tsx'
import { SignUpForm } from './components/sign-up-form.tsx'

export default function SignUp() {
  return (
    <AuthLayout>
      <div className='grid min-h-screen grid-cols-1 lg:grid-cols-2'>
        <div className='relative hidden h-full lg:block'>
          <img
            src={'/app/food-auth.jpg'}
            alt='Delicious food selection'
            className='h-full w-full object-cover brightness-75'
          />
          <div className='absolute bottom-8 left-8 text-white'>
            <h2 className='mb-4 text-4xl font-bold'>EasyBites</h2>
            <p className='text-lg'>Your favorite meals, delivered fast</p>
          </div>
        </div>

        <div className='flex items-center justify-center p-6'>
          <Card className='w-full max-w-md border-0 shadow-lg'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-2xl font-bold text-gray-900'>
                Create Your Account
              </CardTitle>
              <CardDescription className='mt-2 text-gray-600'>
                Join EasyBites for quick deliveries and exclusive offers
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SignUpForm />
            </CardContent>

            <CardFooter className='flex flex-col items-center pt-4'>
              <p className='text-sm text-gray-600'>
                Already have an account?{' '}
                <Link
                  to='/sign-in'
                  className='text-primary font-semibold hover:underline'
                >
                  Sign In
                </Link>
              </p>
              <p className='mt-4 text-center text-xs text-gray-500'>
                By continuing, you agree to our{' '}
                <a href='/terms' className='text-primary hover:underline'>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href='/privacy' className='text-primary hover:underline'>
                  Privacy Policy
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthLayout>
  )
}
