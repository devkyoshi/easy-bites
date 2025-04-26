import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import {IconBurger, IconCategory, IconTrash} from '@tabler/icons-react'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,

  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'

import {IRestaurant, useRestaurant} from "@/features/restaurants/context/restaurant-context.tsx";

import {router} from "@/lib/router.ts";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function RestaurantTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const selectedRestaurant = (row.original) as IRestaurant

  const { setOpen, setCurrentRow } = useRestaurant()


  const handleNavigateToCategoriesTab = () => {
    router.navigate( { to: `/restaurants/restaurant-category-management` , state : { restaurantId: selectedRestaurant.restaurantId  }  as never })
  }

    const handleNavigateToFoodItemsTab = () => {
        router.navigate( { to: `/restaurants/restaurant-food-management` , state : { restaurantId: selectedRestaurant.restaurantId  }  as never })
    }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(selectedRestaurant)
            setOpen('update')
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNavigateToCategoriesTab}>Categories

          <DropdownMenuShortcut>
            <IconCategory size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNavigateToFoodItemsTab}>Food Items

          <DropdownMenuShortcut>
            <IconBurger size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(selectedRestaurant)
            setOpen('delete')
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
