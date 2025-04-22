import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {IconBasket} from "@tabler/icons-react";


// Mock data type - replace with your actual cart item type
type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

export const Cart = () => {

    // Mock cart items - replace with your actual cart state
    const cartItems: CartItem[] = [
        { id: '1', name: 'Product 1', price: 29.99, quantity: 2 },
        { id: '2', name: 'Product 2', price: 49.99, quantity: 1 },
        // ... more items
    ];

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                    <IconBasket className="h-4 w-4"/>
                    <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full h-4 w-4 text-xs flex items-center justify-center">
                        {cartItems.length}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-64' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium'>Your Cart</p>
                        <p className='text-muted-foreground text-xs'>
                            {cartItems.length} item{cartItems.length !== 1 && 's'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup className="max-h-60 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <div className="py-4 text-center text-sm text-muted-foreground">
                            Your cart is empty
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between px-2 py-1.5">
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.quantity} × ${item.price.toFixed(2)}
                                    </p>
                                </div>
                                <p className="text-sm font-medium">
                                    ${(item.quantity * item.price).toFixed(2)}
                                </p>
                            </div>
                        ))
                    )}
                </DropdownMenuGroup>

                {cartItems.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="flex items-center justify-between px-2 py-2">
                            <span className="text-sm font-medium">Total:</span>
                            <span className="text-sm font-medium">${total.toFixed(2)}</span>
                        </div>
                    </>
                )}

                <DropdownMenuSeparator />
                <div className="p-2">
                    <Button
                        variant="default"
                        className="w-full"
                    >
                        View Cart
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}