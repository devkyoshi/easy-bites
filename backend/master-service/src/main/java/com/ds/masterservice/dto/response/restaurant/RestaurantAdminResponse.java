package com.ds.masterservice.dto.response.restaurant;

import com.ds.masterservice.dto.response.food.FoodItemResponse;
import com.ds.masterservice.dto.response.menu.MenuCategoryInitResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
/**
 * RestaurantAdminResponse is a DTO class that represents the response for restaurant details
 * specifically for admin users. It contains various fields related to the restaurant's information.
 */

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantAdminResponse {
    private Long restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private String logo;
    private String description;
    private String openingHour;
    private String closingHour;
    private List<String> daysOpen;
    private Boolean isOpen;
    private String address;
    private String phone;
    private String email;
    private List<FoodItemResponse> foodItems;
    private List<MenuCategoryInitResponse> menuCategories;
}
