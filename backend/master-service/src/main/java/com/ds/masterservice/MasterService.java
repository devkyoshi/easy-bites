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
import com.ds.masterservice.service.RoleService;
import com.ds.masterservice.service.UserService;

import java.math.BigDecimal;
import java.util.List;

public interface MasterService {
    UserService getUserService();
    RoleService getRoleService();

    //User Service Methods
    RestaurantManager getRestaurantManagerByUserId(Integer userId) throws CustomException;

    //Restaurant Service Methods
    ApiResponse<RestaurantResponse> getRestaurant(Long restaurantId) throws CustomException;

    ApiResponse<RestaurantInitResponse> createRestaurant(RestaurantCreateUpdateRequest request) throws CustomException;

    ApiResponse<MenuCategoryResponse> addMenuCategory(Long restaurantId, MenuCategoryCreateRequest request) throws CustomException ;

    ApiResponse<FoodItemResponse> addFoodItems(Long restaurantId, FoodItemRequest request) throws CustomException;

    ApiResponse<List<MenuCategoryResponse>> getMenuCategories(Long restaurantId) throws CustomException;

    ApiResponse<List<FoodItemResponse>> getFoodItems(Long restaurantId) throws CustomException;

    ApiResponse<List<RestaurantInitResponse>> getAllRestaurants() throws CustomException;

    ApiResponse<List<DriverResponse>> getAllDrivers() throws CustomException;

    ApiResponse<DriverResponse> getDriver(Long driverId) throws CustomException;

    ApiResponse<DriverResponse> updateDriver(Long driverId, DriverRegistrationRequest registrationDTO) throws CustomException;

    ApiResponse<String> deleteDriver(Long driverId) throws CustomException;

    ApiResponse<LocationUpdateResponse> updateLocation(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException;

    ApiResponse<String> setDriverAvailability(Long driverId, boolean isAvailable) throws CustomException;

    ApiResponse<List<DriverResponse>> getAvailableDrivers() throws CustomException;

    ApiResponse<List<OrderResponse>> getNearbyOrders(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException;

    ApiResponse<String> notifyNearbyDriversForNewOrder(Long orderId) throws CustomException;

    ApiResponse<DeliveryResponse> acceptOrder(Long driverId, DeliveryAcceptanceRequest dto) throws CustomException;

    ApiResponse<DeliveryResponse> completeDelivery(Long deliveryId, DeliveryCompletionRequest dto) throws CustomException;

    ApiResponse<List<DeliveryHistoryResponse>> getDeliveryHistory(Long driverId) throws CustomException;

    ApiResponse<List<DeliveryResponse>> getAllDeliveries() throws CustomException;

    ApiResponse<DeliveryResponse> getDelivery(Long deliveryId) throws CustomException;

    ApiResponse<DeliveryResponse> getActiveDelivery(Long driverId) throws CustomException;

    ApiResponse<String> rateDelivery(Long deliveryId, DeliveryRatingRequest request) throws CustomException;

    ApiResponse<List<WeeklyStatsResponse>> getWeeklyStats(Long driverId) throws CustomException;

    ApiResponse<List<RatingDistributionResponse>> getRatingDistribution(Long driverId) throws CustomException;

    ApiResponse<Double> getAverageRating(Long driverId) throws CustomException;

    ApiResponse<RestaurantAdminResponse> getAdminRestaurantData(Integer restaurantId) throws CustomException;

    ApiResponse<FoodItemResponse> updateFoodItem(Long restaurantId, Long foodItemId, FoodItemRequest request) throws CustomException;

    ApiResponse<Void> deleteFoodItem(Long restaurantId, Long foodItemId) throws CustomException;

    ApiResponse<MenuCategoryResponse> updateMenuCategory(Long restaurantId, Long menuCategoryId, MenuCategoryCreateRequest request) throws CustomException;

    ApiResponse<Void> deleteMenuCategory(Long restaurantId, Long menuCategoryId) throws CustomException;

    ApiResponse<DeliveryResponse> getByOrderId(Long orderId) throws CustomException;

    ApiResponse<RegisterResponse> registerRestaurantManager(RestaurantManagerRequestDTO restaurantManager) throws CustomException;

    ApiResponse<RegisterResponse> registerDriver(DriverRegistrationRequest driverRegistrationRequest) throws CustomException;

    ApiResponse<List<OrderReqResponse>> getOrdersByRestaurantId(Long restaurantId) throws CustomException;

}
