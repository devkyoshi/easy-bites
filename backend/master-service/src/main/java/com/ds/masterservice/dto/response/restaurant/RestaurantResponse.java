package com.ds.masterservice.dto.response.restaurant;


import com.ds.masterservice.dto.response.food.FoodItemInitResponse;
import com.ds.masterservice.dto.response.menu.MenuCategoryInitResponse;
import lombok.Data;

import java.util.List;

@Data
public class RestaurantResponse {
    private Long restaurantId;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String logoUrl;
    private Boolean isOpen;
    private String openingHour;
    private String closingHour;
    private List<String> daysOpen;
    private List<FoodItemInitResponse> foodItems;
    private List<MenuCategoryInitResponse> menuCategories;

}




