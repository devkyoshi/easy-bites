import { createFileRoute } from '@tanstack/react-router';
import DeliveryTab from "@/features/deliveries";

export const Route = createFileRoute('/_authenticated/deliveries/')({
  component: DeliveryTab,
});