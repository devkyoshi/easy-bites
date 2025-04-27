package com.ds.masterservice;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.RestaurantManager;
import com.ds.masterservice.dto.request.food.FoodItemRequest;
import com.ds.masterservice.dto.request.menu.MenuCategoryCreateRequest;
import com.ds.masterservice.dto.request.restaurant.RestaurantCreateUpdateRequest;
import com.ds.masterservice.dto.response.food.FoodItemResponse;
import com.ds.masterservice.dto.response.menu.MenuCategoryResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantAdminResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantInitResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantResponse;
import com.ds.masterservice.service.RestaurantService;
import com.ds.masterservice.service.RoleService;
import com.ds.masterservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MasterServiceImpl implements MasterService {

    private final UserService userService;
    private final RoleService roleService;
    private final RestaurantService restaurantService;

    @Autowired
    public MasterServiceImpl(UserService userService, RoleService roleService, RestaurantService restaurantService) {
        this.userService = userService;
        this.roleService = roleService;
        this.restaurantService = restaurantService;
    }

    @Override
    public UserService getUserService() {
        return userService;
    }

    @Override
    public RoleService getRoleService() {
        return roleService;
    }


    @Override
    public RestaurantManager getRestaurantManagerByUserId(Integer userId) throws CustomException {
        return userService.getRestaurantManagerByUserId(userId);
    }

    @Override
    public ApiResponse<RestaurantResponse> getRestaurant(Long restaurantId) throws CustomException {
        return restaurantService.getRestaurant(restaurantId);
    }

    @Override
    public ApiResponse<RestaurantInitResponse> createRestaurant(RestaurantCreateUpdateRequest request) throws CustomException {
        return restaurantService.createRestaurant(request);
    }

    @Override
    public ApiResponse<MenuCategoryResponse> addMenuCategory(Long restaurantId, MenuCategoryCreateRequest request) throws CustomException {
        return restaurantService.addMenuCategory(restaurantId, request);
    }

    @Override
    public ApiResponse<FoodItemResponse> addFoodItems(Long restaurantId, FoodItemRequest request) throws CustomException {
        return restaurantService.addFoodItems(restaurantId, request);
    }

    @Override
    public ApiResponse<List<MenuCategoryResponse>> getMenuCategories(Long restaurantId) throws CustomException {
        return restaurantService.getMenuCategories(restaurantId);
    }

    @Override
    public ApiResponse<List<FoodItemResponse>> getFoodItems(Long restaurantId) throws CustomException {
        return restaurantService.getFoodItems(restaurantId);
    }

    @Override
    public ApiResponse<List<RestaurantInitResponse>> getAllRestaurants() throws CustomException {
        return restaurantService.getAllRestaurants();
    }

    @Override
    public ApiResponse<RestaurantAdminResponse> getAdminRestaurantData(Integer restaurantId) throws CustomException {
        return restaurantService.getAdminRestaurantData(restaurantId);
    }

    @Override
    public ApiResponse<FoodItemResponse> updateFoodItem(Long restaurantId, Long foodItemId, FoodItemRequest request) throws CustomException {
        return restaurantService.updateFoodItem(restaurantId, foodItemId, request);
    }

    @Override
    public ApiResponse<Void> deleteFoodItem(Long restaurantId, Long foodItemId) throws CustomException {
        return restaurantService.deleteFoodItem(restaurantId, foodItemId);
    }

    @Override
    public ApiResponse<MenuCategoryResponse> updateMenuCategory(Long restaurantId, Long menuCategoryId, MenuCategoryCreateRequest request) throws CustomException {
        return restaurantService.updateMenuCategory(restaurantId, menuCategoryId, request);
    }

    @Override
    public ApiResponse<Void> deleteMenuCategory(Long restaurantId, Long menuCategoryId) throws CustomException {
        return restaurantService.deleteMenuCategory(restaurantId, menuCategoryId);
    }
}
