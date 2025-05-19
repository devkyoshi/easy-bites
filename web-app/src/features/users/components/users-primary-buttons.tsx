import { IconMailPlus, IconUserPlus, IconUserCheck } from '@tabler/icons-react'
import { Button } from '@/components/ui/button.tsx'
import { useUsers } from '../context/users-context.tsx'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('invite')}
      >
        <span>Invite User</span> <IconMailPlus size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add User</span> <IconUserPlus size={18} />
      </Button>
      <Button 
        variant='outline'
        className='space-x-1' 
        onClick={() => setOpen('staff-registrations')}
      >
        <span>Staff Registrations</span> <IconUserCheck size={18} />
      </Button>
    </div>
  )
}
