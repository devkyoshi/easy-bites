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
  signIn: (creds: LoginRequest) => Promise<void>
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
    const interval = setInterval(checkAuthState, 30000) // Check every 30 seconds
    checkAuthState() // Initial check

    return () => clearInterval(interval)
  }, [checkAuthState])

  // signIn calls your service, then updates state & storage
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
  }

  const logout = () => {
    setCurrentUser(null)
    setAccessToken('')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('access_token')
    router.invalidate().then()
  }

  const value: AuthContextType = { currentUser, accessToken, signIn, logout }
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
