export interface IRestaurantDetails{
    restaurantId: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    logoUrl:string;
    isOpen:boolean;
    openingHour:string;
    closingHour:string;
    daysOpen: string [];
    foodItems: IFoodItem[],
    menuCategories: IMenuCategory[]
}

export interface IFoodItem {
    foodItemId:number;
    name: string;
    description:string;
    price:number;
    imageUrl:string;
    categoryName:string;
}

export interface IMenuCategory {
    categoryId: number;
    name: string;
}