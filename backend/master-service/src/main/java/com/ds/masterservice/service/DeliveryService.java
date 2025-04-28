package com.ds.masterservice.service;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.Deliveries;
import com.ds.masterservice.dto.request.DeliveryAcceptanceRequest;
import com.ds.masterservice.dto.request.DeliveryCompletionRequest;
import com.ds.masterservice.dto.request.DeliveryRatingRequest;
import com.ds.masterservice.dto.response.DeliveryHistoryResponse;
import com.ds.masterservice.dto.response.DeliveryResponse;
import com.ds.masterservice.dto.response.RatingDistributionResponse;
import com.ds.masterservice.dto.response.WeeklyStatsResponse;
import com.ds.masterservice.dto.response.orderService.OrderResponse;

import java.math.BigDecimal;
import java.util.List;

public interface DeliveryService {
    ApiResponse<List<OrderResponse>> getNearbyOrders(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException;
    ApiResponse<String> notifyNearbyDriversForNewOrder(Long orderId) throws CustomException;
    ApiResponse<DeliveryResponse> acceptOrder(Long driverId, DeliveryAcceptanceRequest dto) throws CustomException;
    ApiResponse<DeliveryResponse> completeDelivery(Long deliveryId, DeliveryCompletionRequest dto) throws CustomException;
    ApiResponse<List<DeliveryHistoryResponse>> getDeliveryHistory(Long driverId) throws CustomException;
    ApiResponse<List<Deliveries>> getAllDeliveries() throws CustomException;
    ApiResponse<DeliveryResponse> getDelivery(Long deliveryId) throws CustomException;
    ApiResponse<DeliveryResponse> getActiveDelivery(Long driverId) throws CustomException;
    ApiResponse<String> rateDelivery(Long deliveryId, DeliveryRatingRequest request) throws CustomException;
    ApiResponse<List<WeeklyStatsResponse>> getWeeklyStats(Long driverId) throws CustomException;
    ApiResponse<List<RatingDistributionResponse>> getRatingDistribution(Long driverId) throws CustomException;
    ApiResponse<Double> getAverageRating(Long driverId) throws CustomException;
}
