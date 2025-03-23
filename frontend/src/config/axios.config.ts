import axios, { InternalAxiosRequestConfig } from 'axios';
import {getLocalStorage} from "@/config/localstorage.config.ts";

// Load environment variables for Vite
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL as string;

// Create an Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token (if it exists) to each request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const userData = getLocalStorage();
        if (userData && userData.token && config.headers) {
            config.headers.Authorization = `Bearer ${userData.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default api;