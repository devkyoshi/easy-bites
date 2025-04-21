package com.ds.masterservice;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.Restaurant;
import com.ds.masterservice.dao.RestaurantManager;
import com.ds.masterservice.dto.request.FoodItemRequest;
import com.ds.masterservice.dto.request.MenuCategoryCreateRequest;
import com.ds.masterservice.dto.request.RestaurantCreateUpdateRequest;
import com.ds.masterservice.dto.response.FoodItemResponse;
import com.ds.masterservice.dto.response.MenuCategoryResponse;
import com.ds.masterservice.dto.response.RestaurantInitResponse;
import com.ds.masterservice.service.RoleService;
import com.ds.masterservice.service.UserService;

public interface MasterService {
    UserService getUserService();
    RoleService getRoleService();

    //User Service Methods
    RestaurantManager getRestaurantManagerByUserId(Integer userId) throws CustomException;

    //Restaurant Service Methods

    Restaurant getRestaurant();

    ApiResponse<RestaurantInitResponse> createRestaurant(RestaurantCreateUpdateRequest request) throws CustomException;

    ApiResponse<MenuCategoryResponse> addMenuCategory(Long restaurantId, MenuCategoryCreateRequest request) throws CustomException ;

    ApiResponse<FoodItemResponse> addFoodItems(Long restaurantId, FoodItemRequest request) throws CustomException;
}
