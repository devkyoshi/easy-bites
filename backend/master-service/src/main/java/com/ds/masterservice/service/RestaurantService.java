package com.ds.masterservice.service;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.Restaurant;
import com.ds.masterservice.dto.request.FoodItemRequest;
import com.ds.masterservice.dto.request.MenuCategoryCreateRequest;
import com.ds.masterservice.dto.request.RestaurantCreateUpdateRequest;
import com.ds.masterservice.dto.response.FoodItemResponse;
import com.ds.masterservice.dto.response.MenuCategoryResponse;
import com.ds.masterservice.dto.response.RestaurantInitResponse;
import com.ds.masterservice.dto.response.RestaurantResponse;

import java.util.List;

public interface RestaurantService {

    ApiResponse<RestaurantResponse> getRestaurant(Long restaurantId) throws CustomException;
    ApiResponse<RestaurantInitResponse> createRestaurant(RestaurantCreateUpdateRequest request) throws CustomException;
    ApiResponse<MenuCategoryResponse> addMenuCategory(Long restaurantId, MenuCategoryCreateRequest request) throws CustomException;
    ApiResponse<FoodItemResponse> addFoodItems(Long restaurantId, FoodItemRequest request) throws CustomException;
    ApiResponse<List<MenuCategoryResponse>> getMenuCategories(Long restaurantId) throws CustomException;
    ApiResponse<List<FoodItemResponse>> getFoodItems(Long restaurantId) throws CustomException;
 }
