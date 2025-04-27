package com.ds.masterservice.dto.response.food;

import com.ds.masterservice.dao.restaurantService.FoodItem;
import lombok.Data;

@Data
public class FoodItemInitResponse {
    private Long foodItemId;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private String categoryName;


    public FoodItemInitResponse() {
    }

    public FoodItemInitResponse(FoodItem foodItem) {
        this.foodItemId = foodItem.getId();
        this.name = foodItem.getName();
        this.description = foodItem.getDescription();
        this.price = foodItem.getPrice();
        this.imageUrl = foodItem.getImageUrl();
        this.categoryName = foodItem.getCategory().getName();
    }
}
