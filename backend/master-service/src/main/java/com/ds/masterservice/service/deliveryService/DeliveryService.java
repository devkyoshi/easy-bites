package com.ds.masterservice.service.deliveryService;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.deliveryService.Deliveries;
import com.ds.masterservice.dto.request.deliveryService.DeliveryAcceptanceRequest;
import com.ds.masterservice.dto.request.deliveryService.DeliveryCompletionRequest;
import com.ds.masterservice.dto.request.deliveryService.DeliveryRatingRequest;
import com.ds.masterservice.dto.response.deliveryService.DeliveryHistoryResponse;
import com.ds.masterservice.dto.response.deliveryService.DeliveryResponse;
import com.ds.masterservice.dto.response.RatingDistributionResponse;
import com.ds.masterservice.dto.response.WeeklyStatsResponse;
import com.ds.masterservice.dto.response.orderService.OrderResponse;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service interface for managing delivery operations.
 */
public interface DeliveryService {

    /**
     * Retrieve nearby orders based on the driver's current location.
     *
     * @param driverId unique identifier of the driver
     * @param lat      latitude of the driver's current location
     * @param lng      longitude of the driver's current location
     * @return ApiResponse containing a list of nearby OrderResponse objects
     * @throws CustomException if retrieval fails
     */
    ApiResponse<List<OrderResponse>> getNearbyOrders(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException;

    /**
     * Notify nearby available drivers about a new order.
     *
     * @param orderId unique identifier of the new order
     * @return ApiResponse containing success message
     * @throws CustomException if notification fails
     */
    ApiResponse<String> notifyNearbyDriversForNewOrder(Long orderId) throws CustomException;

    /**
     * Accept a new delivery order by a driver.
     *
     * @param driverId unique identifier of the driver accepting the order
     * @param dto      delivery acceptance details
     * @return ApiResponse containing the accepted DeliveryResponse
     * @throws CustomException if acceptance fails
     */
    ApiResponse<DeliveryResponse> acceptOrder(Long driverId, DeliveryAcceptanceRequest dto) throws CustomException;

    /**
     * Complete a delivery by providing necessary details.
     *
     * @param deliveryId unique identifier of the delivery
     * @param dto        delivery completion details
     * @return ApiResponse containing the completed DeliveryResponse
     * @throws CustomException if completion fails
     */
    ApiResponse<DeliveryResponse> completeDelivery(Long deliveryId, DeliveryCompletionRequest dto) throws CustomException;

    /**
     * Retrieve delivery history for a specific driver.
     *
     * @param driverId unique identifier of the driver
     * @return ApiResponse containing a list of DeliveryHistoryResponse objects
     * @throws CustomException if retrieval fails
     */
    ApiResponse<List<DeliveryResponse>> getDeliveryHistory(Long driverId) throws CustomException;

    /**
     * Retrieve all deliveries in the system.
     *
     * @return ApiResponse containing a list of all DeliveryResponse objects
     * @throws CustomException if retrieval fails
     */
    ApiResponse<List<DeliveryResponse>> getAllDeliveries() throws CustomException;

    /**
     * Retrieve details of a specific delivery by its ID.
     *
     * @param deliveryId unique identifier of the delivery
     * @return ApiResponse containing the DeliveryResponse
     * @throws CustomException if delivery is not found
     */
    ApiResponse<DeliveryResponse> getDelivery(Long deliveryId) throws CustomException;

    /**
     * Retrieve the active delivery currently being handled by a driver.
     *
     * @param driverId unique identifier of the driver
     * @return ApiResponse containing the active DeliveryResponse
     * @throws CustomException if no active delivery is found
     */
    ApiResponse<DeliveryResponse> getActiveDelivery(Long driverId) throws CustomException;

    /**
     * Rate a completed delivery.
     *
     * @param deliveryId unique identifier of the delivery
     * @param request    rating request containing score and optional feedback
     * @return ApiResponse containing success message
     * @throws CustomException if rating submission fails
     */
    ApiResponse<String> rateDelivery(Long deliveryId, DeliveryRatingRequest request) throws CustomException;

    /**
     * Get weekly delivery statistics for a specific driver.
     *
     * @param driverId unique identifier of the driver
     * @return ApiResponse containing a list of WeeklyStatsResponse objects
     * @throws CustomException if stats retrieval fails
     */
    ApiResponse<List<WeeklyStatsResponse>> getWeeklyStats(Long driverId) throws CustomException;

    /**
     * Get rating distribution statistics for a specific driver.
     *
     * @param driverId unique identifier of the driver
     * @return ApiResponse containing a list of RatingDistributionResponse objects
     * @throws CustomException if retrieval fails
     */
    ApiResponse<List<RatingDistributionResponse>> getRatingDistribution(Long driverId) throws CustomException;

    /**
     * Get the average rating for a specific driver.
     *
     * @param driverId unique identifier of the driver
     * @return ApiResponse containing the average rating as a double
     * @throws CustomException if retrieval fails
     */
    ApiResponse<Double> getAverageRating(Long driverId) throws CustomException;

    /**
     * Retrieve delivery information using the associated order ID.
     *
     * @param orderId unique identifier of the order
     * @return ApiResponse containing the related DeliveryResponse
     * @throws CustomException if delivery is not found
     */
    ApiResponse<DeliveryResponse> getByOrderId(Long orderId) throws CustomException;
}
