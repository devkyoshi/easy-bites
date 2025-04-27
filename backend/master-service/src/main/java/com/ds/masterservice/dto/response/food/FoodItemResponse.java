package com.ds.masterservice.dto.response.food;

import com.ds.masterservice.dao.FoodItem;
import lombok.Data;

@Data
public class FoodItemResponse {
    private Long foodItemId;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private Long restaurantId;
    private Boolean isAvailable;
    private Integer stockQuantityPerDay;

    public FoodItemResponse(FoodItem foodItem) {
        this.foodItemId = foodItem.getId();
        this.name = foodItem.getName();
        this.description = foodItem.getDescription();
        this.price = foodItem.getPrice();
        this.imageUrl = foodItem.getImageUrl();
        this.categoryId = foodItem.getCategory().getId();
        this.categoryName = foodItem.getCategory().getName();
        this.restaurantId = foodItem.getRestaurant().getId();
        this.isAvailable = foodItem.getIsAvailable();
        this.stockQuantityPerDay = foodItem.getStockQuantityPerDay();
    }
}
