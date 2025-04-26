import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { addFoodItem } from '@/services/restaurant-service'
import {
  FoodItem,
  AddFoodItemRequest,
  IMenuCategory,
} from '@/services/types/restaurant.type'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export const FoodItemForm = ({
  open,
  onOpenChange,
  foodItem,
  onSuccess,
  restaurantId,
  menuCategories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  foodItem?: FoodItem | null
  onSuccess: () => void
  restaurantId: number
  menuCategories: IMenuCategory[]
}) => {
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<AddFoodItemRequest>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (foodItem) {
      setValue('name', foodItem.name)
      setValue('description', foodItem.description)
      setValue('price', foodItem.price)
      setValue('imageUrl', foodItem.imageUrl)
      setValue('stockQuantityPerDay', foodItem.stockQuantityPerDay)
      setValue('isAvailable', foodItem.isAvailable)
      setValue('categoryId', foodItem.categoryId)
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        stockQuantityPerDay: 0,
        isAvailable: true,
        categoryId: undefined,
      })
    }
  }, [foodItem, setValue, reset])

  const onSubmit = async (data: AddFoodItemRequest) => {
    setIsSubmitting(true)
    const toastId = toast.loading(
      foodItem ? 'Updating item...' : 'Adding new item...'
    )

    try {
      const response = await addFoodItem(restaurantId, data)

      if (!response.success) {
        toast.dismiss(toastId)
        toast.error(response.message, {
          duration: 5000,
          position: 'top-center',
        })
        return
      }

      toast.success(
        foodItem ? 'Item updated successfully' : 'Item added successfully',
        { id: toastId }
      )
      onSuccess()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {foodItem ? 'Edit Food Item' : 'Add New Food Item'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Item Name *</Label>
            <Input
              id='name'
              {...register('name', { required: true })}
              placeholder='Enter item name'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description *</Label>
            <Textarea
              id='description'
              {...register('description', { required: true })}
              placeholder='Enter item description'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='price'>Price ($) *</Label>
              <Input
                id='price'
                type='number'
                step='0.01'
                {...register('price', { required: true, min: 0.01 })}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='stock'>Daily Stock *</Label>
              <Input
                id='stock'
                type='number'
                {...register('stockQuantityPerDay', { required: true, min: 0 })}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='imageUrl'>Image URL *</Label>
              <Input
                id='imageUrl'
                {...register('imageUrl', { required: true })}
                placeholder='Enter image URL'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='categoryId'>Category *</Label>
              <Select
                onValueChange={(value) => setValue('categoryId', Number(value))}
                defaultValue={foodItem?.categoryId?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
                <SelectContent>
                  {menuCategories.map((category) => (
                    <SelectItem
                      key={category.categoryId}
                      value={category.categoryId.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Switch
              id='available'
              checked={watch('isAvailable')}
              onCheckedChange={(checked) => setValue('isAvailable', checked)}
              defaultChecked={foodItem?.isAvailable ?? true}
            />
            <Label htmlFor='available'>Available</Label>
          </div>

          <Button type='submit' className='mt-4' disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : foodItem
                ? 'Save Changes'
                : 'Add Item'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
