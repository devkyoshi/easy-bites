package com.ds.deliveryservice.controller;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.MasterService;
import com.ds.masterservice.dao.deliveryService.Deliveries;
import com.ds.masterservice.dto.request.deliveryService.DeliveryAcceptanceRequest;
import com.ds.masterservice.dto.request.deliveryService.DeliveryCompletionRequest;
import com.ds.masterservice.dto.request.deliveryService.DeliveryRatingRequest;
import com.ds.masterservice.dto.request.deliveryService.DriverRegistrationRequest;
import com.ds.masterservice.dto.response.*;
import com.ds.masterservice.dto.response.deliveryService.DeliveryHistoryResponse;
import com.ds.masterservice.dto.response.deliveryService.DeliveryResponse;
import com.ds.masterservice.dto.response.deliveryService.DriverResponse;
import com.ds.masterservice.dto.response.orderService.OrderResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final MasterService masterService;

    public DeliveryController(MasterService masterService) {
        this.masterService = masterService;
    }

    @GetMapping("/health")
    public String health() {
        return "Delivery Service is up and running!";
    }

    @GetMapping("/orders/nearby")
    public ApiResponse<List<OrderResponse>> getNearbyOrders(
            @RequestParam("driverId") Long driverId,
            @RequestParam("lat") BigDecimal lat,
            @RequestParam("lng") BigDecimal lng
    ) throws CustomException {
        log.info("Fetching nearby orders for driver ID: {}", driverId);
        return masterService.getNearbyOrders(driverId, lat, lng);
    }

    @PostMapping("/drivers/notify")
    public ApiResponse<String> notifyDrivers(@RequestParam("orderId") Long orderId) throws CustomException {
        log.info("Notifying nearby drivers for order ID: {}", orderId);
        return masterService.notifyNearbyDriversForNewOrder(orderId);
    }

    @PostMapping("/orders/accept")
    public ApiResponse<DeliveryResponse> acceptOrder(
            @RequestParam("driverId") Long driverId,
            @RequestBody DeliveryAcceptanceRequest dto
    ) throws CustomException {
        log.info("Driver ID {} attempting to accept order", driverId);
        return masterService.acceptOrder(driverId, dto);
    }

    @PostMapping("/delivery/complete")
    public ApiResponse<DeliveryResponse> completeDelivery(
            @RequestParam("deliveryId") Long deliveryId,
            @RequestBody DeliveryCompletionRequest dto
    ) throws CustomException {
        log.info("Completing delivery ID: {}", deliveryId);
        return masterService.completeDelivery(deliveryId, dto);
    }

    @GetMapping("/delivery/history")
    public ApiResponse<List<DeliveryHistoryResponse>> getDeliveryHistory(@RequestParam("driverId") Long driverId) throws CustomException {
        log.info("Fetching delivery history for driver ID: {}", driverId);
        return masterService.getDeliveryHistory(driverId);
    }

    @GetMapping("/delivery")
    public ApiResponse<List<DeliveryResponse>> getAllDeliveries() throws CustomException {
        log.info("Fetching all deliveries.");
        return masterService.getAllDeliveries();
    }

    @GetMapping("/delivery/{deliveryId}")
    public ApiResponse<DeliveryResponse> getDelivery(@PathVariable Long deliveryId) throws CustomException {
        log.info("Fetching delivery for delivery ID: {}", deliveryId);
        return masterService.getDelivery(deliveryId);
    }

    @GetMapping("/delivery/active")
    public ApiResponse<DeliveryResponse> getActiveDelivery(@RequestParam("driverId") Long driverId) throws CustomException {
        log.info("Fetching active delivery for driver ID: {}", driverId);
        return masterService.getActiveDelivery(driverId);
    }

    @GetMapping("/analytics/weekly")
    public ApiResponse<List<WeeklyStatsResponse>> getWeeklyStats(
            @RequestParam("driverId") Long driverId) throws CustomException {
        return masterService.getWeeklyStats(driverId);
    }

    @GetMapping("/analytics/ratings")
    public ApiResponse<List<RatingDistributionResponse>> getRatingDistribution(
            @RequestParam("driverId") Long driverId) throws CustomException {
        return masterService.getRatingDistribution(driverId);
    }

    @GetMapping("/analytics/average-rating")
    public ApiResponse<Double> getAverageRating(
            @RequestParam("driverId") Long driverId) throws CustomException {
        return masterService.getAverageRating(driverId);
    }

    @PostMapping("/delivery/{deliveryId}/rate")
    public ApiResponse<String> rateDelivery(
            @PathVariable("deliveryId") Long deliveryId,
            @Valid @RequestBody DeliveryRatingRequest request) throws CustomException {
        return masterService.rateDelivery(deliveryId, request);
    }

    // --- Driver Endpoints ---

    @GetMapping("/drivers")
    public ApiResponse<List<DriverResponse>> getAllDrivers() throws CustomException {
        log.info("Fetching all delivery drivers");
        return masterService.getAllDrivers();
    }

    @GetMapping("/drivers/{driverId}")
    public ApiResponse<DriverResponse> getDriver(@PathVariable("driverId") Long driverId) throws CustomException {
        log.info("Fetching driver ID: {}", driverId);
        return masterService.getDriver(driverId);
    }

    @PutMapping("/drivers/{driverId}")
    public ApiResponse<DriverResponse> updateDriver(
            @PathVariable("driverId") Long driverId,
            @RequestBody DriverRegistrationRequest registrationDTO
    ) throws CustomException {
        log.info("Updating driver ID: {}", driverId);
        return masterService.updateDriver(driverId, registrationDTO);
    }

    @DeleteMapping("/drivers/{driverId}")
    public ApiResponse<String> deleteDriver(@PathVariable("driverId") Long driverId) throws CustomException {
        log.info("Deleting driver ID: {}", driverId);
        return masterService.deleteDriver(driverId);
    }

    @PutMapping("/drivers/{driverId}/location")
    public ApiResponse<String> updateLocation(
            @PathVariable("driverId") Long driverId,
            @RequestParam BigDecimal lat,
            @RequestParam BigDecimal lng
    ) throws CustomException {
        log.info("Updating location for driver ID: {}", driverId);
        return masterService.updateLocation(driverId, lat, lng);
    }

    @PutMapping("/drivers/{driverId}/availability")
    public ApiResponse<String> setDriverAvailability(
            @PathVariable("driverId") Long driverId,
            @Valid @RequestParam("isAvailable") boolean isAvailable
    ) throws CustomException {
        log.info("Setting availability for driver ID: {} to {}", driverId, isAvailable);
        return masterService.setDriverAvailability(driverId, isAvailable);
    }

    @GetMapping("/drivers/available")
    public ApiResponse<List<DriverResponse>> getAvailableDrivers() throws CustomException {
        log.info("Fetching available drivers");
        return masterService.getAvailableDrivers();
    }
}
