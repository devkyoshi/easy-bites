import { createFileRoute } from '@tanstack/react-router'
import { StaffRegistrationPage } from '@/features/staff/pages/StaffRegistrationPage.tsx'

export const Route = createFileRoute('/(auth)/staff-signup')({
  component: StaffRegistrationPage,
})
