import { useEffect, useState } from 'react'
import { getAllUsers } from '@/services/admin-service.ts'
import { toast } from 'sonner'
import { SearchProvider } from '@/context/search-context.tsx'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { Search } from '@/components/search.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { columns } from './components/users-columns.tsx'
import { UsersDialogs } from './components/users-dialogs.tsx'
import { UsersPrimaryButtons } from './components/users-primary-buttons.tsx'
import { UsersTable } from './components/users-table.tsx'
import UsersProvider from './context/users-context.tsx'
import { userListSchema } from './data/schema.ts'
import { User } from './data/schema.ts'

export default function Users() {
  const [userList, setUserList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const users = await getAllUsers()

        // Transform the API response to match the User schema
        const transformedUsers = users.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber || '',
          status: user.enabled ? 'active' : 'inactive',
          role: user.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))

        const parsedUsers = userListSchema.parse(transformedUsers)
        setUserList(parsedUsers)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        toast.error('Failed to load users. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <SearchProvider>
      <UsersProvider>
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
              <p className='text-muted-foreground'>
                Manage your users and their roles here.
              </p>
            </div>
            <UsersPrimaryButtons />
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
            {loading ? (
              <div className='flex h-64 items-center justify-center'>
                <p>Loading users...</p>
              </div>
            ) : (
              <UsersTable data={userList} columns={columns} />
            )}
          </div>
        </Main>

        <UsersDialogs />
      </UsersProvider>
    </SearchProvider>
  )
}
