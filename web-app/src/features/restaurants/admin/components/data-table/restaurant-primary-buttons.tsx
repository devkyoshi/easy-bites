import {  IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button.tsx'
import {useRestaurant} from "@/features/restaurants/context/restaurant-context.tsx";


export function RestaurantPrimaryButtons() {
  const { setOpen } = useRestaurant()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
