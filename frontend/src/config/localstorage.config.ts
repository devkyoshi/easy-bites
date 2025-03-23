// Function to get the user data from localStorage under the APP_NAME key
import {UserData} from "@/config/axios.config.ts";


const APP_NAME: string = import.meta.env.VITE_APP_NAME as string;

export const getLocalStorage = (): UserData | null => {
    const namespacedKey = `${APP_NAME}_userData`;
    const storedData = localStorage.getItem(namespacedKey);
    return storedData ? JSON.parse(storedData) : null;
};

// Function to set the user data in localStorage under the APP_NAME key
export const setLocalStorage = (data: UserData): void => {
    const namespacedKey = `${APP_NAME}_userData`;
    localStorage.setItem(namespacedKey, JSON.stringify(data));
};

export const removeLocalStorage = () => {
    const namespacedKey = `${APP_NAME}_userData`;
    localStorage.removeItem(namespacedKey);
};