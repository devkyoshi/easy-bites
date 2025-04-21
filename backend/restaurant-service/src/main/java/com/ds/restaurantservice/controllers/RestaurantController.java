package com.ds.restaurantservice.controllers;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.MasterService;
import com.ds.masterservice.dto.request.FoodItemRequest;
import com.ds.masterservice.dto.request.MenuCategoryCreateRequest;
import com.ds.masterservice.dto.request.RestaurantCreateUpdateRequest;
import com.ds.masterservice.dto.response.FoodItemResponse;
import com.ds.masterservice.dto.response.MenuCategoryResponse;
import com.ds.masterservice.dto.response.RestaurantInitResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private MasterService masterService;

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

    @PostMapping("/{restaurantId}/food-items")
    public ApiResponse<FoodItemResponse> addFoodItems(@RequestBody FoodItemRequest request, @PathVariable("restaurantId") Long restaurantId) throws CustomException {
        log.info("Attempting to add food item for restaurant with ID: {}", restaurantId);
        return masterService.addFoodItems(restaurantId, request);
    }


}
