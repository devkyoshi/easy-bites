import { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth-context.tsx'
import { useNavigate } from '@tanstack/react-router'
import { USER_TYPES } from '@/config/user-types.ts'
import { formatBackendMessage } from '@/utils/server-msg-utils.ts'

export function GoogleOAuthButton() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { signInWithGoogleOAuth } = useAuth()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      toast.info('Connecting to Google...', {
        duration: 2000,
        position: 'top-center',
      })
      
      // Check environment variables for debugging
      console.log('Firebase Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
      console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
      
      const loggedUser = await signInWithGoogleOAuth()
      
      toast.success('Logged in with Google successfully!', {
        duration: 2000,
        position: 'top-center',
      })

      // Redirect based on role
      if (loggedUser?.role === USER_TYPES.ROLE_CUSTOMER) {
        navigate({ to: '/restaurants' }).then()
        return
      }

      // Other roles will use traditional login
      // The backend should be configured to only allow customer role for OAuth users

    } catch (err: any) {
      console.error('Google login error:', err)
      
      let errorMessage = 'Google login failed'
      
      // Handle specific Firebase Auth errors
      if (err.code) {
        switch (err.code) {
          case 'auth/popup-blocked':
            errorMessage = 'Popup was blocked by the browser. Please allow popups for this site.'
            break
          case 'auth/popup-closed-by-user':
            errorMessage = 'Authentication popup was closed before completing the sign-in.'
            break
          case 'auth/cancelled-popup-request': 
            errorMessage = 'Multiple popup requests were detected. Only one popup can be open at a time.'
            break
          case 'auth/network-request-failed':
            errorMessage = 'Network error occurred. Please check your internet connection.'
            break
          case 'auth/configuration-error':
            errorMessage = 'Firebase configuration error. Please check your Firebase project settings.'
            break
          case 'auth/internal-error':
            errorMessage = 'An internal Firebase authentication error occurred. Please try again later.'
            break
          default:
            errorMessage = `Error during Google authentication: ${err.message || err.code}`
        }
      } else {
        errorMessage = formatBackendMessage(err.message as string) || 'Google login failed'
      }
      
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      type="button"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-r-transparent" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <g clipPath="url(#clip0_34_12)">
            <path
              d="M15.4001 8.116C15.4001 7.48636 15.3478 7.02688 15.2346 6.5504H7.87695V9.29096H12.1957C12.1087 10.0896 11.6385 11.2212 10.5873 11.9804L10.5725 12.0883L12.9173 13.9022L13.0755 13.9176C14.5825 12.5506 15.4001 10.5208 15.4001 8.116Z"
              fill="#4285F4"
            />
            <path
              d="M7.87696 15.9999C10.0008 15.9999 11.7712 15.2999 13.0756 13.9175L10.5874 11.9803C9.93344 12.4379 9.04896 12.7542 7.87696 12.7542C5.80464 12.7542 4.04336 11.3522 3.4172 9.4402L3.31376 9.44784L0.876161 11.3381L0.845764 11.4358C2.14168 14.1047 4.76232 15.9999 7.87696 15.9999Z"
              fill="#34A853"
            />
            <path
              d="M3.4172 9.44016C3.2516 8.96448 3.15448 8.45048 3.15448 7.99992C3.15448 7.54936 3.2516 7.03536 3.4084 6.55968L3.40384 6.45808L0.932401 4.52891L0.845766 4.56396C0.30976 5.62356 0 6.77512 0 7.99992C0 9.22472 0.30976 10.3762 0.845766 11.4359L3.4172 9.44016Z"
              fill="#FBBC05"
            />
            <path
              d="M7.87696 3.24584C9.34812 3.24584 10.3416 3.9242 10.8969 4.45296L13.1055 2.27336C11.7625 0.999961 10.0008 0.0800781 7.87696 0.0800781C4.76232 0.0800781 2.14168 1.97524 0.845764 4.5642L3.40841 6.56008C4.04336 4.648 5.80464 3.24584 7.87696 3.24584Z"
              fill="#EB4335"
            />
          </g>
          <defs>
            <clipPath id="clip0_34_12">
              <rect width="15.4286" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )}
      {isLoading ? 'Signing In...' : 'Continue with Google'}
    </Button>
  )
}