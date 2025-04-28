package com.ds.masterservice;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.Deliveries;
import com.ds.masterservice.dao.RestaurantManager;
import com.ds.masterservice.dto.request.*;
import com.ds.masterservice.dto.response.*;
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

    ApiResponse<String> updateLocation(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException;

    ApiResponse<String> setDriverAvailability(Long driverId, boolean isAvailable) throws CustomException;

    ApiResponse<List<DriverResponse>> getAvailableDrivers() throws CustomException;

    ApiResponse<List<OrderResponse>> getNearbyOrders(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException;

    ApiResponse<String> notifyNearbyDriversForNewOrder(Long orderId) throws CustomException;

    ApiResponse<DeliveryResponse> acceptOrder(Long driverId, DeliveryAcceptanceRequest dto) throws CustomException;

    ApiResponse<DeliveryResponse> completeDelivery(Long deliveryId, DeliveryCompletionRequest dto) throws CustomException;

    ApiResponse<List<Deliveries>> getDeliveryHistory(Long driverId) throws CustomException;

    ApiResponse<List<Deliveries>> getAllDeliveries() throws CustomException;

    ApiResponse<DeliveryResponse> getDelivery(Long deliveryId) throws CustomException;

    ApiResponse<DeliveryResponse> getActiveDelivery(Long driverId) throws CustomException;

    ApiResponse<String> rateDelivery(Long deliveryId, DeliveryRatingRequest request) throws CustomException;

    ApiResponse<List<WeeklyStatsResponse>> getWeeklyStats(Long driverId) throws CustomException;

    ApiResponse<List<RatingDistributionResponse>> getRatingDistribution(Long driverId) throws CustomException;

    ApiResponse<Double> getAverageRating(Long driverId) throws CustomException;
}
