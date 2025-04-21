// src/services/auth-service.ts
import { api } from "@/config/axios.ts"

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
    }
}

/**
 * Calls POST /auth/login and returns the `result` object
 */
export async function loginUser(
    request: LoginRequest
): Promise<LoginResponse["result"]> {
    try {
        const { data } = await api.post<LoginResponse>("/auth/login", request)

        if (!data.success) {
            throw new Error(data.message || "Login failed")
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
