import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { IconBasket } from '@tabler/icons-react'
import { api } from '@/config/axios.ts'
import { useAuth } from '@/stores/auth-context.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'

type APIItem = {
  itemId: number
  itemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

type APIResponse = {
  id: number
  userId: number
  restaurantId: number
  restaurantName: string
  items: APIItem[]
  totalAmount: number
  status: string
}

export const Cart = () => {
  const { currentUser } = useAuth()
  const [cart, setCart] = useState<APIResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser?.userId) return
      try {
        const res = await api.get<APIResponse>(
          `http://localhost:8080/api/order/users/${currentUser.userId}/active`
        )
        setCart(res.data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch cart:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart().then()
  }, [])

  const items = cart?.items ?? []
  const totalAmount = cart?.totalAmount ?? 0

  const handleViewCart = () => {
    navigate({
      to: '/cart', // or your specific cart detail route
      // if you need to pass cartId, use search params or a shared store
      // example: search: { cartId: cart?.id?.toString() }
    }).then()
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <IconBasket className='h-4 w-4' />
          {items.length > 0 && (
            <span className='bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white'>
              {items.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-64' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium'>Your Cart</p>
            <p className='text-muted-foreground text-xs'>
              {items.length} item{items.length !== 1 && 's'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup className='max-h-60 overflow-y-auto'>
          {loading ? (
            <div className='text-muted-foreground py-4 text-center text-sm'>
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className='text-muted-foreground py-4 text-center text-sm'>
              Your cart is empty
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.itemId}
                className='flex items-center justify-between px-2 py-1.5'
              >
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{item.itemName}</p>
                  <p className='text-muted-foreground text-xs'>
                    {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>
                <p className='text-sm font-medium'>
                  ${item.totalPrice.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </DropdownMenuGroup>

        {items.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className='flex items-center justify-between px-2 py-2'>
              <span className='text-sm font-medium'>Total:</span>
              <span className='text-sm font-medium'>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </>
        )}

        <DropdownMenuSeparator />
        <div className='p-2'>
          <Button variant='default' className='w-full' onClick={handleViewCart}>
            View Cart
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
