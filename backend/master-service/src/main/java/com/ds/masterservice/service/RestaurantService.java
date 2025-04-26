package com.ds.masterservice.service;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dto.request.food.FoodItemRequest;
import com.ds.masterservice.dto.request.menu.MenuCategoryCreateRequest;
import com.ds.masterservice.dto.request.restaurant.RestaurantCreateUpdateRequest;
import com.ds.masterservice.dto.response.food.FoodItemResponse;
import com.ds.masterservice.dto.response.menu.MenuCategoryResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantAdminResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantInitResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantResponse;

import java.util.List;

public interface RestaurantService {

    ApiResponse<RestaurantResponse> getRestaurant(Long restaurantId) throws CustomException;
    ApiResponse<RestaurantInitResponse> createRestaurant(RestaurantCreateUpdateRequest request) throws CustomException;
    ApiResponse<MenuCategoryResponse> addMenuCategory(Long restaurantId, MenuCategoryCreateRequest request) throws CustomException;
    ApiResponse<FoodItemResponse> addFoodItems(Long restaurantId, FoodItemRequest request) throws CustomException;
    ApiResponse<List<MenuCategoryResponse>> getMenuCategories(Long restaurantId) throws CustomException;
    ApiResponse<List<FoodItemResponse>> getFoodItems(Long restaurantId) throws CustomException;
    ApiResponse<List<RestaurantInitResponse>> getAllRestaurants() throws CustomException;
    ApiResponse<RestaurantAdminResponse> getAdminRestaurantData(Integer restaurantId) throws CustomException;
 }
