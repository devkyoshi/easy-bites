import { createFileRoute } from '@tanstack/react-router'
import cart from "@/features/cart";

export const Route = createFileRoute('/_authenticated/cart/')({
    component: cart,
})

