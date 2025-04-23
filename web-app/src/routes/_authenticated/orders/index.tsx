import { createFileRoute } from '@tanstack/react-router'
import orders from "@/features/orders";

export const Route = createFileRoute('/_authenticated/orders/')({
    component: orders,
})

