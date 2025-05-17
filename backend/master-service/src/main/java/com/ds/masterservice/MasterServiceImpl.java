package com.ds.masterservice;

import com.ds.commons.dto.response.RegisterResponse;
import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.restaurantService.RestaurantManager;
import com.ds.masterservice.dto.request.deliveryService.DeliveryAcceptanceRequest;
import com.ds.masterservice.dto.request.deliveryService.DeliveryCompletionRequest;
import com.ds.masterservice.dto.request.deliveryService.DeliveryRatingRequest;
import com.ds.masterservice.dto.request.deliveryService.DriverRegistrationRequest;
import com.ds.masterservice.dto.request.food.FoodItemRequest;
import com.ds.masterservice.dto.request.menu.MenuCategoryCreateRequest;
import com.ds.masterservice.dto.request.restaurant.RestaurantCreateUpdateRequest;
import com.ds.masterservice.dto.request.user.RestaurantManagerRequestDTO;
import com.ds.masterservice.dto.response.*;
import com.ds.masterservice.dto.response.deliveryService.DeliveryHistoryResponse;
import com.ds.masterservice.dto.response.deliveryService.DeliveryResponse;
import com.ds.masterservice.dto.response.deliveryService.DriverResponse;
import com.ds.masterservice.dto.response.deliveryService.LocationUpdateResponse;
import com.ds.masterservice.dto.response.food.FoodItemResponse;
import com.ds.masterservice.dto.response.menu.MenuCategoryResponse;
import com.ds.masterservice.dto.response.orderService.OrderResponse;
import com.ds.masterservice.dto.response.restaurant.OrderReqResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantAdminResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantInitResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantResponse;
import com.ds.masterservice.service.*;
import com.ds.masterservice.service.deliveryService.DeliveryDriverService;
import com.ds.masterservice.service.deliveryService.DeliveryService;
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

    @Override
    public ApiResponse<DeliveryResponse> getByOrderId(Long orderId) throws CustomException {
        return deliveryService.getByOrderId(orderId);
    }

    @Override
    public ApiResponse<List<DriverResponse>> getAllDrivers() throws CustomException {
        return deliveryDriverService.getAllDrivers();
    }

    @Override
    public ApiResponse<DriverResponse> getDriver(Long driverId) throws CustomException {
        return deliveryDriverService.getDriver(driverId);
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
    public ApiResponse<LocationUpdateResponse> updateLocation(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException {
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
    public ApiResponse<List<DeliveryHistoryResponse>> getDeliveryHistory(Long driverId) throws CustomException {
        return deliveryService.getDeliveryHistory(driverId);
    }

    @Override
    public ApiResponse<List<DeliveryResponse>> getAllDeliveries() throws CustomException {
        return deliveryService.getAllDeliveries();
    }

    @Override
    public ApiResponse<DeliveryResponse> getDelivery(Long deliveryId) throws CustomException {
        return deliveryService.getDelivery(deliveryId);
    }

    @Override
    public ApiResponse<DeliveryResponse> getActiveDelivery(Long driverId) throws CustomException {
        return deliveryService.getActiveDelivery(driverId);
    }

    @Override
    public ApiResponse<String> rateDelivery(Long deliveryId, DeliveryRatingRequest request) throws CustomException {
        return deliveryService.rateDelivery(deliveryId, request);
    }

    @Override
    public ApiResponse<List<WeeklyStatsResponse>> getWeeklyStats(Long driverId) throws CustomException {
        return deliveryService.getWeeklyStats(driverId);
    }

    @Override
    public ApiResponse<List<RatingDistributionResponse>> getRatingDistribution(Long driverId) throws CustomException {
        return deliveryService.getRatingDistribution(driverId);
    }

    @Override
    public ApiResponse<Double> getAverageRating(Long driverId) throws CustomException {
        return deliveryService.getAverageRating(driverId);
    }

    @Override
    public ApiResponse<RegisterResponse> registerRestaurantManager(RestaurantManagerRequestDTO restaurantManager) throws CustomException {
        return userService.registerRestaurantManager(restaurantManager);
    }

    @Override
    public ApiResponse<RegisterResponse> registerDriver(DriverRegistrationRequest driverRegistrationRequest) throws CustomException {
        return userService.registerDriver(driverRegistrationRequest);
    }

    @Override
    public ApiResponse<List<OrderReqResponse>> getOrdersByRestaurantId(Long restaurantId) throws CustomException {
        return restaurantService.getOrdersByRestaurantId(restaurantId);
    }
}
