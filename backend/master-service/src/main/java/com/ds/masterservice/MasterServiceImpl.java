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
import com.ds.masterservice.dto.response.RestaurantResponse;
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
}
