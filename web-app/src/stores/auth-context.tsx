import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { loginUser, LoginRequest } from '@/services/auth-service.ts'
import { router } from '@/lib/router'
import { isTokenExpired } from '@/utils/jwt-util-functions.ts'
import { signInWithGoogle } from '@/lib/firebase.ts'
import { authenticateWithFirebase } from '@/services/firebase-auth-service.ts'


interface AuthUser {
  userId: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthContextType {
  currentUser: AuthUser | null
  accessToken: string
  signIn: (creds: LoginRequest) => Promise<AuthUser>
  signInWithGoogleOAuth: () => Promise<AuthUser>
  logout: () => void
}

// ⚠️ We expose this ref so non-React code (e.g. interceptors) can call logout()
export const authRef: { current: AuthContextType | null } = {
  current: null,
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState('')

  // on-mount: hydrate from localStorage
  useEffect(() => {
    const usr = localStorage.getItem('auth_user')
    const tok = localStorage.getItem('access_token')
    if (usr) setCurrentUser(JSON.parse(usr))
    if (tok) setAccessToken(tok)
  }, [])

  const checkAuthState = useCallback(() => {
    const token = localStorage.getItem('access_token')
    if (!token || isTokenExpired(token)) {
      logout()
    }
  }, [])

  useEffect(() => {
    // Hydrate state from localStorage
    const usr = localStorage.getItem('auth_user')
    const tok = localStorage.getItem('access_token')

    if (usr) setCurrentUser(JSON.parse(usr))
    if (tok) setAccessToken(tok)

    // Set up the expiration checker
    const interval = setInterval(checkAuthState, 600000) // Check every 1 seconds
    checkAuthState() // Initial check

    return () => clearInterval(interval)
  }, [checkAuthState])

  // signIn calls your service, then updates state and storage
  const signIn = async ({ username, password }: LoginRequest) => {
    const data = await loginUser({ username, password })

    const {
      userId,
      email,
      firstName,
      lastName,
      accessToken,
      username: uname,
      role,
    } = data

    const user: AuthUser = {
      userId,
      username: uname,
      email,
      firstName,
      lastName,
      role,
    }

    // set in state
    setCurrentUser(user)
    setAccessToken(accessToken)

    // persist
    localStorage.setItem('auth_user', JSON.stringify(user))
    localStorage.setItem('access_token', accessToken)

    return data
  }

  const logout = () => {
    setCurrentUser(null)
    setAccessToken('')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('access_token')
    router.invalidate().then()
    router.navigate({ to: '/sign-in', replace: true })
  }

  // Google OAuth sign in
  const signInWithGoogleOAuth = async () => {
    try {
      // First authenticate with Firebase
      const googleAuthResult = await signInWithGoogle()
      
      // Log the Firebase token for debugging - REMOVE IN PRODUCTION
      console.log('Firebase authentication successful');
      
      // Then authenticate with our backend using the Firebase token
      const data = await authenticateWithFirebase(googleAuthResult)

      const {
        userId,
        email,
        firstName,
        lastName,
        accessToken,
        username: uname,
        role,
      } = data

      const user: AuthUser = {
        userId,
        username: uname,
        email,
        firstName,
        lastName,
        role,
      }

      // set in state
      setCurrentUser(user)
      setAccessToken(accessToken)

      // persist
      localStorage.setItem('auth_user', JSON.stringify(user))
      localStorage.setItem('access_token', accessToken)

      return data
    } catch (error: any) {
      console.error("Google OAuth error:", error);
      
      // Clear any partial auth state
      localStorage.removeItem('auth_user')
      localStorage.removeItem('access_token')
      
      // Rethrow the error so it can be handled by the component
      throw error;
    }
  }

  const value: AuthContextType = { 
    currentUser, 
    accessToken, 
    signIn, 
    signInWithGoogleOAuth,
    logout 
  }
  authRef.current = value

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be inside AuthProvider')
  }
  return ctx
}
