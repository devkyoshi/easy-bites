// src/routes/_authenticated/orders/order-details.tsx
import { createFileRoute } from '@tanstack/react-router'
import {OrderDetails} from "@/features/orders/components/order-details.tsx";

export const Route = createFileRoute('/_authenticated/orders/order-details')({
    component: OrderDetails,
})