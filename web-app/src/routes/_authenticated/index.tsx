import {createFileRoute, redirect} from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'
import {authRef} from "@/stores/authStore.tsx";

export const Route = createFileRoute('/_authenticated/')({


  beforeLoad: () => {
    const isLoggedIn = !!authRef.current?.accessToken

    if (!isLoggedIn) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: Dashboard,
})