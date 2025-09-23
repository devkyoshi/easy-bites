package com.ds.deliveryservice.controller;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;
import com.ds.commons.utils.GeocodingUtil;
import com.ds.communicationservice.CommunicationService;
import com.ds.deliveryservice.socket.DeliverySocketHandler;
import com.ds.deliveryservice.util.GeoHashUtil;
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
import com.ds.masterservice.dto.response.deliveryService.LocationUpdateResponse;
import com.ds.masterservice.dto.response.orderService.OrderResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantResponse;
import com.ds.masterservice.service.orderService.OrderServiceImpl;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final MasterService masterService;
    private final SocketIOServer socketServer;
    private final DeliverySocketHandler deliverySocketHandler;
    private final OrderServiceImpl orderServiceImpl;
    @Autowired(required = false)
    private Optional<GeocodingUtil> geocodingUtil;
    @Autowired(required = false)
    private CommunicationService communicationService;

    public DeliveryController(MasterService masterService, SocketIOServer socketServer, DeliverySocketHandler deliverySocketHandler, OrderServiceImpl orderServiceImpl) {
        this.masterService = masterService;
        this.socketServer = socketServer;
        this.deliverySocketHandler = deliverySocketHandler;
        this.orderServiceImpl = orderServiceImpl;
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
    public ApiResponse<List<String>> notifyDrivers(@RequestParam("orderId") Long orderId) throws CustomException {
        log.info("Notifying nearby drivers for order ID: {}", orderId);

        // Step 1: Trigger business logic
        ApiResponse<List<String>> response = masterService.notifyNearbyDriversForNewOrder(orderId);

        // Step 2: Get order details
        OrderResponse order = orderServiceImpl.getOrder(orderId);
        if (order == null || order.getItems().isEmpty()) {
            log.warn("Order not found or has no items for ID: {}", orderId);
            return response;
        }

        // Step 3: Extract restaurant ID from first order item
        Long restaurantId = order.getItems().get(0).getRestaurantId();
        if (restaurantId == null) {
            log.warn("Restaurant ID not found in order items for order ID: {}", orderId);
            return response;
        }

        // Step 4: Fetch restaurant details from master service
        RestaurantResponse restaurant = masterService.getRestaurant(restaurantId).getResult();
        if (restaurant == null || restaurant.getAddress() == null) {
            log.warn("Restaurant not found or has no address for ID: {}", restaurantId);
            return response;
        }

        // Step 5: Geocode address to coordinates
        BigDecimal[] coordinates = geocodingUtil
                .orElseThrow(() -> new CustomException(ExceptionCode.GEOCODING_UNAVAILABLE))
                .getCoordinates(restaurant.getAddress());
        BigDecimal lat = coordinates[0];
        BigDecimal lon = coordinates[1];

        // Step 6: Convert lat/lng to location hash (use your own utility)
        String locationHash = GeoHashUtil.encode(lat.doubleValue(), lon.doubleValue());

        // Step 7: Emit socket event to appropriate room
        socketServer.getRoomOperations("area:" + locationHash)
                .sendEvent("newOrderAvailable", order);

        communicationService.sendBulkEmail(response.getResult().toArray(String[]::new), "New Order Nearby!", "New order available please check location: " + locationHash + " order: " + order, false);
        return response;
    }

    @PostMapping("/orders/accept/{driverId}")
    public ApiResponse<DeliveryResponse> acceptOrder(
            @Valid @RequestBody DeliveryAcceptanceRequest dto,
            @PathVariable("driverId") Long driverId) throws CustomException {
        log.info("Driver ID {} attempting to accept order", driverId);
        ApiResponse<DeliveryResponse> response = masterService.acceptOrder(driverId, dto);

        // Notify all clients that order was accepted
        socketServer.getBroadcastOperations().sendEvent("orderAccepted",
                new DeliverySocketHandler.OrderAcceptEvent(driverId, dto.getOrderId()));

        return response;
    }

    @PostMapping("/delivery/complete")
    public ApiResponse<DeliveryResponse> completeDelivery(
            @RequestParam("deliveryId") Long deliveryId,
            @Valid @RequestBody DeliveryCompletionRequest dto
    ) throws CustomException {
        log.info("Completing delivery ID: {}", deliveryId);
        return masterService.completeDelivery(deliveryId, dto);
    }

    @GetMapping("/delivery/history")
    public ApiResponse<List<DeliveryResponse>> getDeliveryHistory(@RequestParam("driverId") Long driverId) throws CustomException {
        log.info("Fetching delivery history for driver ID: {}", driverId);
        return masterService.getDeliveryHistory(driverId);
    }

    @GetMapping("/delivery")
    public ApiResponse<List<DeliveryResponse>> getAllDeliveries() throws CustomException {
        log.info("Fetching all deliveries.");
        return masterService.getAllDeliveries();
    }

    @GetMapping("/delivery/{deliveryId}")
    public ApiResponse<DeliveryResponse> getDelivery(@PathVariable("deliveryId") Long deliveryId) throws CustomException {
        log.info("Fetching delivery for delivery ID: {}", deliveryId);
        return masterService.getDelivery(deliveryId);
    }

    @GetMapping("/delivery/by-order/{orderId}")
    public ApiResponse<DeliveryResponse> getDeliveryByOrderId(@PathVariable("orderId") Long orderId) throws CustomException {
        log.info("Fetching delivery by order ID: {}", orderId);
        return masterService.getByOrderId(orderId);
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
            @Valid @RequestBody DriverRegistrationRequest registrationDTO
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
    public ApiResponse<LocationUpdateResponse> updateLocation(
            @PathVariable("driverId") Long driverId,
            @RequestParam(name = "lat") BigDecimal lat,
            @RequestParam(name = "lng") BigDecimal lng
    ) throws CustomException {
        log.info("Updating location for driver ID: {}", driverId);
        ApiResponse<LocationUpdateResponse> response = masterService.updateLocation(driverId, lat, lng);

        // Use the injected handler
        UUID socketId = deliverySocketHandler.getSocketIdForDriver(driverId);
        if (socketId != null) {
            SocketIOClient client = socketServer.getClient(socketId);
            if (client != null) {
                client.sendEvent("locationUpdated",
                        new DeliverySocketHandler.LocationUpdate(lat, lng));
            }
        }

        return response;
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
