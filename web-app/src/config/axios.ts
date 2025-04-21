import axios from "axios"

import { toast } from "sonner"
import { AxiosError } from "axios"
import {authRef} from "@/stores/auth-context.tsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // if you're handling cookies/session
})

// ——— Request interceptor ———
api.interceptors.request.use((cfg) => {
    const token =
        authRef.current?.accessToken || localStorage.getItem("access_token")
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
})

// ——— Response interceptor ———
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // centralized server‐error handling
        if (error.response) {
            const status = error.response.status

            // your existing handler
            if (status === 401) {
                toast.error("Session expired!")
                authRef.current?.logout()
                // optional: redirect to sign-in
                window.location.href = `/sign-in?redirect=${encodeURIComponent(
                    window.location.href
                )}`
            } else if (status === 403) {
                toast.error("Forbidden")
            } else if (status >= 500) {
                toast.error("Internal Server Error!")
            }
        }

        return Promise.reject(error)
    }
)