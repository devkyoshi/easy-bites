package com.ds.restaurantservice.controllers;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.MasterService;
import com.ds.masterservice.dto.request.food.FoodItemRequest;
import com.ds.masterservice.dto.request.menu.MenuCategoryCreateRequest;
import com.ds.masterservice.dto.request.restaurant.RestaurantCreateUpdateRequest;
import com.ds.masterservice.dto.response.food.FoodItemResponse;
import com.ds.masterservice.dto.response.menu.MenuCategoryResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantAdminResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantInitResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final MasterService masterService;

    @Autowired
    public RestaurantController(MasterService masterService) {
        this.masterService = masterService;
    }

    @GetMapping("/health")
    public String health() {
        return "Restaurant Service is up and running!";
    }

    @PostMapping("/create")
    public ApiResponse<RestaurantInitResponse> createRestaurant(@RequestBody RestaurantCreateUpdateRequest request) throws CustomException {
        return masterService.createRestaurant(request);
    }

    @PostMapping("/{restaurantId}/categories")
    public ApiResponse<MenuCategoryResponse> addMenuCategory(@RequestBody MenuCategoryCreateRequest request, @PathVariable("restaurantId") Long restaurantId) throws CustomException {
        log.info("Attempting to add menu category for restaurant with ID: {}", restaurantId);
        return masterService.addMenuCategory(restaurantId, request);
    }

    //FoodItems
    @PostMapping("/{restaurantId}/food-items")
    public ApiResponse<FoodItemResponse> addFoodItems(@RequestBody FoodItemRequest request, @PathVariable("restaurantId") Long restaurantId) throws CustomException {
        log.info("Attempting to add food item for restaurant with ID: {}", restaurantId);
        return masterService.addFoodItems(restaurantId, request);
    }

    @GetMapping("/{restaurantId}/food-items")
    public ApiResponse<List<FoodItemResponse>> getFoodItems(@PathVariable("restaurantId") Long restaurantId) throws CustomException {
        log.info("Attempting to get food items for restaurant with ID: {}", restaurantId);
        return masterService.getFoodItems(restaurantId);
    }

    @PutMapping("/{restaurantId}/food-items/{foodItemId}")
    public ApiResponse<FoodItemResponse> updateFoodItem(@PathVariable("restaurantId") Long restaurantId, @PathVariable("foodItemId") Long foodItemId, @RequestBody FoodItemRequest request) throws CustomException {
        log.info("Attempting to update food item with ID: {} for restaurant with ID: {}", foodItemId, restaurantId);
        return masterService.updateFoodItem(restaurantId, foodItemId, request);
    }

    @DeleteMapping("/{restaurantId}/food-items/{foodItemId}")
    public ApiResponse<Void> deleteFoodItem(@PathVariable("restaurantId") Long restaurantId, @PathVariable("foodItemId") Long foodItemId) throws CustomException {
        log.info("Attempting to delete food item with ID: {} for restaurant with ID: {}", foodItemId, restaurantId);
        return masterService.deleteFoodItem(restaurantId, foodItemId);
    }

    @GetMapping("/{restaurantId}/categories")
    public ApiResponse<List<MenuCategoryResponse>> getMenuCategories(@PathVariable("restaurantId") Long restaurantId) throws CustomException {
        log.info("Attempting to get menu categories for restaurant with ID: {}", restaurantId);
        return masterService.getMenuCategories(restaurantId);
    }


    @GetMapping("/{restaurantId}")
    public ApiResponse<RestaurantResponse> getRestaurant(@PathVariable("restaurantId") Long restaurantId) throws CustomException {
        log.info("Attempting to get restaurant with ID: {}", restaurantId);
        return masterService.getRestaurant(restaurantId);
    }

    @GetMapping("/all")
    public ApiResponse<List<RestaurantInitResponse>> getAllRestaurants() throws CustomException {
        log.info("Attempting to get all restaurants");
        return masterService.getAllRestaurants();
    }

    @GetMapping("/admin-restaurants/{adminId}")
    public ApiResponse<RestaurantAdminResponse> getAllRestaurantsForAdmin(@PathVariable("adminId") Integer adminId) throws CustomException {
        log.info("Attempting to get restaurant for admin");
        return masterService.getAdminRestaurantData(adminId);
    }


}
