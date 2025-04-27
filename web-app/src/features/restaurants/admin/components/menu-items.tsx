import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@radix-ui/react-alert-dialog'
import {
  IconCategory,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import {
  addMenuCategory,
  deleteMenuCategory,
  updateMenuCategory,
} from '@/services/restaurant-service'
import { FoodItem, IMenuCategory } from '@/services/types/restaurant.type.ts'
import { SettingsIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const MenuCategoryTable = ({
  menus,
  foodItems,
  restaurantId,
  onUpdate,
}: {
  menus: IMenuCategory[]
  foodItems: FoodItem[]
  restaurantId: number
  onUpdate: () => void
}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] =
    useState<IMenuCategory | null>(null)
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>()

  const handleAddCategory = async (data: { name: string }) => {
    await addMenuCategory(restaurantId, data.name)
    onUpdate()
    setOpenDialog(false)
    reset()
  }

  const handleUpdateCategory = async (data: { name: string }) => {
    if (!selectedCategory) return
    await updateMenuCategory(
      restaurantId,
      selectedCategory.categoryId,
      data.name
    )
    onUpdate()
    setOpenDialog(false)
    setSelectedCategory(null)
  }

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return
    if (!restaurantId || !deleteCategoryId) return
    await deleteMenuCategory(restaurantId, deleteCategoryId)
    onUpdate()
    setDeleteCategoryId(null)
    setSelectedCategory(null)
    setDeleteCategoryId(null)
  }

  useEffect(() => {
    if (selectedCategory) {
      reset({ name: selectedCategory.name })
    } else {
      reset({ name: '' })
    }
  }, [selectedCategory, reset])

  return (
    <>
      <Card className='border-0 shadow-sm'>
        <CardHeader className='bg-muted/10 flex flex-row items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-3'>
            <CardTitle className='text-foreground text-xl font-semibold'>
              Menu Categories
            </CardTitle>
            <Badge variant='secondary' className='px-2.5 py-1 font-medium'>
              {menus.length} Categories
            </Badge>
          </div>
          <Button
            onClick={() => setOpenDialog(true)}
            className='bg-primary/90 hover:bg-primary gap-1.5'
          >
            <IconPlus className='h-4.5 w-4.5' />
            Add Category
          </Button>
        </CardHeader>

        <CardContent className='p-6'>
          {menus.length === 0 ? (
            <div className='flex flex-col items-center justify-center space-y-5 rounded-lg border-2 border-dashed p-12'>
              <div className='bg-primary/10 rounded-full p-4'>
                <IconCategory className='text-primary h-8 w-8' />
              </div>
              <p className='text-muted-foreground text-center text-sm'>
                No categories created yet
                <br />
                Start organizing your menu items
              </p>
              <Button
                onClick={() => setOpenDialog(true)}
                variant='outline'
                className='border-primary/30 text-primary hover:bg-primary/5 gap-1.5'
              >
                <IconPlus className='h-4 w-4' />
                Create First Category
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {menus.map((menu) => {
                const itemCount = foodItems.filter(
                  (item) => item.categoryId === menu.categoryId
                ).length

                return (
                  <Card
                    key={menu.categoryId}
                    className='group hover:border-primary/30 relative overflow-hidden transition-all hover:shadow-lg'
                  >
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='bg-primary/10 rounded-lg p-2.5'>
                            <IconCategory className='text-primary h-5 w-5' />
                          </div>
                          <div>
                            <h3 className='text-foreground text-base font-semibold'>
                              {menu.name}
                            </h3>
                            <p className='text-muted-foreground mt-1 text-sm'>
                              {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                            </p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 rounded-md p-0 opacity-0 transition-opacity group-hover:opacity-100'
                            >
                              <SettingsIcon className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-48'>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCategory(menu)
                                setOpenDialog(true)
                              }}
                              className='cursor-pointer gap-2 text-sm'
                            >
                              <IconEdit className='text-muted-foreground h-4 w-4' />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='cursor-pointer gap-2 text-sm text-red-600 hover:bg-red-50'
                              onClick={() =>
                                setDeleteCategoryId(menu.categoryId)
                              }
                            >
                              <IconTrash className='h-4 w-4' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader className='border-b pb-4'>
            <DialogTitle className='text-lg font-semibold'>
              {selectedCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(
              selectedCategory ? handleUpdateCategory : handleAddCategory
            )}
            className='space-y-6 px-6 py-4'
          >
            <div className='space-y-2.5'>
              <Label htmlFor='name' className='text-sm font-medium'>
                Category Name
              </Label>
              <Input
                id='name'
                className='focus-visible:ring-primary/50 h-10 focus-visible:ring-2'
                {...register('name', { required: 'Category name is required' })}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>
            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                type='button'
                onClick={() => {
                  setOpenDialog(false)
                  setSelectedCategory(null)
                }}
                className='px-5'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-primary/90 hover:bg-primary px-5'
              >
                {selectedCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteCategoryId}
        onOpenChange={(open) => !open && setDeleteCategoryId(null)}
      >
        <AlertDialogContent className='max-w-sm'>
          <AlertDialogHeader>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
              <IconTrash className='h-6 w-6 text-red-600' />
            </div>
            <AlertDialogTitle className='text-center text-lg font-semibold'>
              Delete Category?
            </AlertDialogTitle>
            <AlertDialogDescription className='text-muted-foreground text-center text-sm'>
              This will permanently delete the category and remove all
              associated menu items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex items-center justify-center gap-3'>
            <AlertDialogCancel className='hover:bg-muted/50 mt-0 border-0 bg-transparent shadow-none'>
              <Button variant={'outline'}>Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>
              <Button variant='destructive'>Remove </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
