import { Main } from "@/components/layout/main.tsx"
import { useFoodItems } from "@/features/restaurants/context/fooditem-context.tsx"

import { ColumnDef } from "@tanstack/react-table"
import { IFoodItem } from "@/services/types/restaurant.type.ts"
import { Button } from "@/components/ui/button.tsx"
import { Pencil, Trash } from "lucide-react"
import {api} from "@/config/axios.ts";
import {SimpleDataTable} from "@/components/custom/data-table.tsx";


export const FoodItemContent = () => {
    const {
        foodItems,
        setCurrentRow,
        selectedRestaurantId,
        fetchFoodItems
    } = useFoodItems()


    // if(!selectedRestaurantId) router.navigate({ to: '/restaurants/restaurant-management' })

    const handleDeleteFoodItem = (foodItem: IFoodItem) => {
        if (!selectedRestaurantId) return

        api.delete(`/api/${selectedRestaurantId}/food-items/${foodItem.foodItemId}`).then(
            async (response) => {
                if (response.status === 200) {
                    await fetchFoodItems()
                } else {
                    console.error("Failed to delete food item")
                }
            }
        )
    }

    const columns: ColumnDef<IFoodItem>[] = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "description", header: "Description" },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => `$${row.original.price.toFixed(2)}`
        },
        {
            accessorKey: "category.name",
            header: "Category"
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentRow(row.original)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={()=>handleDeleteFoodItem(row.original)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <Main>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Food Items</h2>
                    <Button onClick={() => setCurrentRow({} as IFoodItem)}>
                        Add New Food Item
                    </Button>
                </div>
                <SimpleDataTable data={foodItems} columns={columns} />
            </div>
        </Main>
    )
}