import { api } from '@/config/axios.ts'
import { toast } from 'sonner'

export interface UserResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  enabled: boolean
  phoneNumber: string
}

export interface StaffRegistrationResponse {
  id: number
  user: UserResponse
  isApproved: boolean
  createdAt: string
}

export const getAllUsers = async (): Promise<UserResponse[]> => {
  try {
    const { data } = await api.get('/admin/users')

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch users')
    }

    return data.result
  } catch (err: any) {
    toast.error(
      err.response?.data?.message || 'Error occurred while fetching users',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
    throw err
  }
}

export const getAllStaffRegistrations = async (): Promise<
  StaffRegistrationResponse[]
> => {
  try {
    const { data } = await api.get('/admin/staff-registrations')

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch staff registrations')
    }

    return data.result
  } catch (err: any) {
    toast.error(
      err.response?.data?.message ||
        'Error occurred while fetching staff registrations',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
    throw err
  }
}

export const approveStaffRegistration = async (
  id: number
): Promise<boolean> => {
  try {
    const { data } = await api.put(`/admin/approve-staff/${id}`)

    if (!data.success) {
      throw new Error(data.message || 'Failed to approve staff registration')
    }

    toast.success('Staff registration approved successfully', {
      duration: 3000,
      position: 'top-center',
    })

    return data.result
  } catch (err: any) {
    toast.error(
      err.response?.data?.message ||
        'Error occurred while approving staff registration',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
    throw err
  }
}

export const rejectStaffRegistration = async (id: number): Promise<boolean> => {
  try {
    const { data } = await api.put(`/admin/reject-staff/${id}`)

    if (!data.success) {
      throw new Error(data.message || 'Failed to reject staff registration')
    }

    toast.success('Staff registration rejected successfully', {
      duration: 3000,
      position: 'top-center',
    })

    return data.result
  } catch (err: any) {
    toast.error(
      err.response?.data?.message ||
        'Error occurred while rejecting staff registration',
      {
        duration: 5000,
        position: 'top-center',
      }
    )
    throw err
  }
}
