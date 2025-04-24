package com.ds.masterservice;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.Deliveries;
import com.ds.masterservice.dao.Restaurant;
import com.ds.masterservice.dao.RestaurantManager;
import com.ds.masterservice.dto.request.*;
import com.ds.masterservice.dto.response.*;
import com.ds.masterservice.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MasterServiceImpl implements MasterService {

    private final UserService userService;
    private final RoleService roleService;
    private final RestaurantService restaurantService;
    private final DeliveryService deliveryService;
    private final DeliveryDriverService deliveryDriverService;

    @Autowired
    public MasterServiceImpl(UserService userService, RoleService roleService, RestaurantService restaurantService, DeliveryService deliveryService, DeliveryDriverService deliveryDriverService) {
        this.userService = userService;
        this.roleService = roleService;
        this.restaurantService = restaurantService;
        this.deliveryService = deliveryService;
        this.deliveryDriverService = deliveryDriverService;
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
    public ApiResponse<List<DriverResponse>> getAllDrivers() throws CustomException {
        return deliveryDriverService.getAllDrivers();
    }

    @Override
    public ApiResponse<DriverResponse> updateDriver(Long driverId, DriverRegistrationRequest registrationDTO) throws CustomException {
        return deliveryDriverService.updateDriver(driverId, registrationDTO);
    }

    @Override
    public ApiResponse<String> deleteDriver(Long driverId) throws CustomException {
        return deliveryDriverService.deleteDriver(driverId);
    }

    @Override
    public ApiResponse<String> updateLocation(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException {
        return deliveryDriverService.updateLocation(driverId, lat, lng);
    }

    @Override
    public ApiResponse<String> setDriverAvailability(Long driverId, boolean isAvailable) throws CustomException {
        return deliveryDriverService.setDriverAvailability(driverId, isAvailable);
    }

    @Override
    public ApiResponse<List<DriverResponse>> getAvailableDrivers() throws CustomException {
        return deliveryDriverService.getAvailableDrivers();
    }

    @Override
    public ApiResponse<List<OrderResponse>> getNearbyOrders(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException {
        return deliveryService.getNearbyOrders(driverId, lat, lng);
    }

    @Override
    public ApiResponse<String> notifyNearbyDriversForNewOrder(Long orderId) throws CustomException {
        return deliveryService.notifyNearbyDriversForNewOrder(orderId);
    }

    @Override
    public ApiResponse<DeliveryResponse> acceptOrder(Long driverId, DeliveryAcceptanceRequest dto) throws CustomException {
        return deliveryService.acceptOrder(driverId, dto);
    }

    @Override
    public ApiResponse<DeliveryResponse> completeDelivery(Long deliveryId, DeliveryCompletionRequest dto) throws CustomException {
        return deliveryService.completeDelivery(deliveryId, dto);
    }

    @Override
    public ApiResponse<List<Deliveries>> getDeliveryHistory(Long driverId) throws CustomException {
        return deliveryService.getDeliveryHistory(driverId);
    }

    @Override
    public ApiResponse<DeliveryResponse> getActiveDelivery(Long driverId) throws CustomException {
        return deliveryService.getActiveDelivery(driverId);
    }
}
