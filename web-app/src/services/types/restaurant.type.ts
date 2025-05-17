export interface IRestaurantDetails {
  restaurantId: number
  name: string
  description: string
  address: string
  phone: string
  email: string
  logoUrl: string
  isOpen: boolean
  openingHour: string
  closingHour: string
  daysOpen: string[]
  foodItems: IFoodItem[]
  menuCategories: IMenuCategory[]
}

export interface IFoodItem {
  foodItemId: number
  name: string
  description: string
  price: number
  imageUrl: string
  categoryName: string
}

export interface IMenuCategory {
  categoryId: number
  name: string
}

// Admin Panel Interfaces

//Used in the admin panel to show the restaurant details
export interface AdminRestaurantResult {
  restaurantId: number
  restaurantName: string
  restaurantAddress: string
  logo: string
  description: string
  openingHour: string
  closingHour: string
  daysOpen: string[]
  isOpen: boolean
  address: string
  phone: string
  email: string
  foodItems: FoodItem[]
  menuCategories: IMenuCategory[]
}

//Used in the admin panel to show the food items
export interface FoodItem {
  foodItemId: number
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: number
  categoryName: string
  restaurantId: number
  isAvailable: boolean
  stockQuantityPerDay: number
}

export interface AddFoodItemRequest {
  name: string
  description: string
  price: number
  imageUrl: string
  stockQuantityPerDay: number
  isAvailable: boolean
  categoryId: number
}

export interface RestaurantOrderItem {
  itemId: number
  itemName: string
  totalPrice: number
  unitPrice: number
  itemImage: string
  quantity: number
}

export interface RestaurantOrder {
  orderId: number
  orderItems: RestaurantOrderItem[]
  orderStatus: string
  paymentStatus: string
  orderDate: string
  deliveryAddress: string
  totalAmount: number
  customerName: string
  customerPhone: string
}

export interface OrderAcceptance {
  orderId: number
  status: string
}
