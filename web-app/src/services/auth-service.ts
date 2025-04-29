import { api } from '@/config/axios.ts'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  message: string
  success: boolean
  result: {
    userId: number
    username: string
    email: string
    firstName: string
    lastName: string
    accessToken: string
    role: string
  }
}

export async function loginUser(
  request: LoginRequest
): Promise<LoginResponse['result']> {
  try {
    const { data } = await api.post<LoginResponse>('/auth/login', request)

    if (!data.success) {
      throw new Error(data.message || 'Login failed')
    }

    return data.result
  } catch (err: any) {
    // normalize and rethrow
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message)
    }
    throw err
  }
}

interface IUserRegistration {
  firstName: string
  lastName: string
  username: string
  password: string
  email: string
  address: string
  phoneNumber: string
}

export const registerUser = async (request: IUserRegistration) => {
  try {
    const { data } = await api.post<LoginResponse>('/auth/register', request)

    if (!data.success) {
      throw new Error(data.message || 'Login failed')
    }

    return data.result
  } catch (err: any) {
    // normalize and rethrow
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message)
    }
    throw err
  }
}
