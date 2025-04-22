import { Main } from "@/components/layout/main.tsx"
import { useFoodItems } from "@/features/restaurants/context/fooditem-context.tsx"

import { ColumnDef } from "@tanstack/react-table"
import { IMenuCategory } from "@/services/types/restaurant.type.ts"
import { Button } from "@/components/ui/button.tsx"
import { Pencil, Trash } from "lucide-react"
import {SimpleDataTable} from "@/components/custom/data-table.tsx";



export const MenuCategoryContent = () => {
    const {
        categories,
        selectedRestaurantId
    } = useFoodItems()

    // if(!selectedRestaurantId) router.navigate({ to: '/restaurants/restaurant-management' })

    const columns: ColumnDef<IMenuCategory>[] = [
        { accessorKey: "name", header: "Name" },
        {
            id: "actions",
            cell: () => ( //{row}
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        /*onClick={async () => {
                            if (!selectedRestaurantId) return
                            try {
                                await api.delete(`/api/${selectedRestaurantId}/categories/${row.original.id}`)
                                await fetchCategories()
                            } catch (error) {
                                console.error("Failed to delete category:", error)
                            }
                        }}*/
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
                    <h2 className="text-2xl font-bold">Menu Categories</h2>
                    <Button>
                        Add New Category
                    </Button>
                </div>
                <SimpleDataTable data={categories} columns={columns} />
            </div>
        </Main>
    )
}