package com.ds.masterservice.service.deliveryService;

import com.ds.commons.enums.DeliveryStatus;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.NoContentException;
import com.ds.commons.exception.NotFoundException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;
import com.ds.commons.utils.EmailUtil;
import com.ds.commons.utils.GeoUtils;
import com.ds.commons.utils.GeocodingUtil;
import com.ds.masterservice.dao.*;
import com.ds.masterservice.dao.deliveryService.Deliveries;
import com.ds.masterservice.dao.deliveryService.DeliveryPerson;
import com.ds.masterservice.dao.orderService.Order;
import com.ds.masterservice.dao.orderService.OrderStatus;
import com.ds.masterservice.dto.request.deliveryService.DeliveryAcceptanceRequest;
import com.ds.masterservice.dto.request.deliveryService.DeliveryCompletionRequest;
import com.ds.masterservice.dto.request.deliveryService.DeliveryRatingRequest;
import com.ds.masterservice.dto.response.deliveryService.DeliveryHistoryResponse;
import com.ds.masterservice.dto.response.deliveryService.DeliveryResponse;
import com.ds.masterservice.dto.response.RatingDistributionResponse;
import com.ds.masterservice.dto.response.WeeklyStatsResponse;
import com.ds.masterservice.dto.response.orderService.OrderResponse;
import com.ds.masterservice.repository.*;
import com.ds.masterservice.repository.deliveryService.DeliveryDriverRepository;
import com.ds.masterservice.repository.deliveryService.DeliveryRepository;
import com.ds.masterservice.repository.orderService.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DeliveryServiceImpl implements DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final DeliveryDriverRepository deliveryDriverRepository;
    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    @Autowired(required = false)
    private Optional<GeocodingUtil> geocodingUtil;
    @Autowired(required = false)
    private Optional<EmailUtil> emailUtil;
    private final Set<Long> notifiedOrderIds = new HashSet<>();
    private static final double DELIVERY_RADIUS_KM = 55.0;

    @Autowired
    public DeliveryServiceImpl(DeliveryRepository deliveryRepository, DeliveryDriverRepository deliveryDriverRepository, OrderRepository orderRepository, RestaurantRepository restaurantRepository, UserRepository userRepository ) {
        this.deliveryRepository = deliveryRepository;
        this.deliveryDriverRepository = deliveryDriverRepository;
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ApiResponse<List<OrderResponse>> getNearbyOrders(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException {
        try {
            log.debug("Fetching nearby orders for driverId: {}", driverId);

            DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.DRIVER_NOT_FOUND));

            driver.setCurrentLat(lat);
            driver.setCurrentLng(lng);
            deliveryDriverRepository.save(driver);

            List<Order> orders = orderRepository.findByStatus(OrderStatus.RESTAURANT_ACCEPTED);

            List<OrderResponse> nearbyOrders = new ArrayList<>();

            log.debug("Found {} orders in RESTAURANT_ACCEPTED status", orders.size());
            for (Order order : orders) {
                try {
                    BigDecimal[] coordinates = geocodingUtil
                            .orElseThrow(() -> new CustomException(ExceptionCode.GEOCODING_UNAVAILABLE))
                            .getCoordinates(order.getDeliveryAddress());
                    log.debug("Order {} address {} converted to coordinates: {}, {}",
                            order.getId(), order.getDeliveryAddress(), coordinates[0], coordinates[1]);

                    double distance = GeoUtils.calculateDistance(
                            lat,
                            lng,
                            coordinates[0],
                            coordinates[1]
                    );
                    log.debug("Distance for order {}: {} km (radius: {} km)",
                            order.getId(), distance, DELIVERY_RADIUS_KM);

                    if (distance <= DELIVERY_RADIUS_KM) {
                        nearbyOrders.add(convertOrderToResponse(order));
                    }
                } catch (CustomException e) {
                    log.warn("Geocoding failed for order ID {}: {}", order.getId(), e.getMessage());
                }
            }

            return ApiResponse.successResponse("Nearby orders fetched", nearbyOrders);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("Unexpected error in getNearbyOrders: {}", e.getMessage(), e);
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    private OrderResponse convertOrderToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setPaymentStatus(String.valueOf(order.getPaymentStatus()));
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        return response;
    }
//    public ApiResponse<List<OrderResponse>> getNearbyOrders(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException {
//        try {
//            log.debug("Fetching nearby orders for driverId: {}", driverId);
//
//            DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
//                    .orElseThrow(() -> new CustomException(ExceptionCode.DRIVER_NOT_FOUND));
//
//            driver.setCurrentLat(lat);
//            driver.setCurrentLng(lng);
//            deliveryDriverRepository.save(driver);
//
//            List<OrderResponse> orders = orderRepository.findByStatus(OrderStatus.RESTAURANT_ACCEPTED);
//            List<OrderResponse> nearbyOrders = new ArrayList<>();
//
//            for (OrderResponse order : orders) {
//                try {
//                    BigDecimal[] coordinates = geocodingUtil
//                            .orElseThrow(() -> new CustomException(ExceptionCode.GEOCODING_UNAVAILABLE))
//                            .getCoordinates(order.getDeliveryAddress());
//
//                    double distance = GeoUtils.calculateDistance(
//                            lat,
//                            lng,
//                            coordinates[0],
//                            coordinates[1]
//                    );
//                    if (distance <= DELIVERY_RADIUS_KM) {
//                        nearbyOrders.add(order);
//                    }
//                } catch (CustomException e) {
//                    log.warn("Geocoding failed for order ID {}: {}", order.getId(), e.getMessage());
//                }
//            }
//
//            return ApiResponse.successResponse("Nearby orders fetched", nearbyOrders);
//        } catch (Exception e) {
//            if (e instanceof CustomException) {
//                throw (CustomException) e;
//            } else {
//                log.error("Unexpected error in getNearbyOrders: {}", e.getMessage(), e);
//                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
//            }
//        }
//    }

    public ApiResponse<String> notifyNearbyDriversForNewOrder(Long orderId) throws CustomException {
        try {
            var order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));

            if (notifiedOrderIds.contains(orderId)) {
                log.debug("Order ID {} already notified", orderId);
                return ApiResponse.successResponse("Drivers already notified for this order");
            }

            BigDecimal[] orderCoords = geocodingUtil
                    .orElseThrow(() -> new CustomException(ExceptionCode.GEOCODING_UNAVAILABLE))
                    .getCoordinates(order.getDeliveryAddress());

            List<DeliveryPerson> drivers = deliveryDriverRepository.findByIsAvailable(true);

            int notifiedCount = 0;

            for (DeliveryPerson driver : drivers) {
                if (driver.getCurrentLat() == null || driver.getCurrentLng() == null) continue;

                double distance = GeoUtils.calculateDistance(
                        orderCoords[0], orderCoords[1],
                        driver.getCurrentLat(), driver.getCurrentLng()
                );

                if (distance <= DELIVERY_RADIUS_KM) {
                    String subject = "New Order Nearby!";
                    String fullName = driver.getFirstName() + " " + driver.getLastName();
                    String message = String.format("Hi %s, a new order is available within %.1f KM from your location. Order ID: %d",
                            fullName, distance, order.getId());

                    //sendEmailWithFallback(driver.getEmail(), subject, message);
                    notifiedCount++;
                }
            }

            if (notifiedCount > 0) {
                notifiedOrderIds.add(orderId); // Mark as notified
                return ApiResponse.successResponse("Drivers notified successfully");
            } else {
                return ApiResponse.successResponse("No available drivers nearby to notify");
            }
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("Error notifying drivers for order {}: {}", orderId, e.getMessage(), e);
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    @Transactional
    public ApiResponse<DeliveryResponse> acceptOrder(Long driverId, DeliveryAcceptanceRequest dto) throws CustomException {
        try {
            log.debug("Driver {} attempting to accept order {}", driverId, dto.getOrderId());

            DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.DRIVER_NOT_FOUND));

            if (!driver.getIsAvailable()) {
                log.error("Driver {} is not available", driverId);
                throw new CustomException(ExceptionCode.DRIVER_NOT_AVAILABLE);
            }

            Order order = orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));

            // 🛠️ Get restaurantId from the first order item
            if (order.getItems() == null || order.getItems().isEmpty()) {
                throw new CustomException(ExceptionCode.ORDER_ITEM_NOT_FOUND);
            }

            Long restaurantId = order.getItems().getFirst().getRestaurantId(); // Assuming all items are from the same restaurant
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND));

            boolean alreadyAssigned = deliveryRepository.existsByOrderAndStatusIn(
                    order, List.of(DeliveryStatus.ACCEPTED)
            );

            if (alreadyAssigned) {
                log.error("Order {} is already in progress.", dto.getOrderId());
                throw new CustomException(ExceptionCode.DRIVER_ACCEPTED_ORDER);
            }

            order.setStatus(OrderStatus.DRIVER_ASSIGNED);
            orderRepository.save(order);

            BigDecimal[] orderCoordinates = geocodingUtil
                    .orElseThrow(() -> new CustomException(ExceptionCode.GEOCODING_UNAVAILABLE))
                    .getCoordinates(order.getDeliveryAddress());

            BigDecimal[] restaurantCoordinates = geocodingUtil
                    .orElseThrow(() -> new CustomException(ExceptionCode.GEOCODING_UNAVAILABLE))
                    .getCoordinates(restaurant.getAddress());

            Deliveries delivery = new Deliveries();
            delivery.setOrder(order);
            delivery.setDriver(driver);
            delivery.setPickupLat(restaurantCoordinates[0]);
            delivery.setPickupLng(restaurantCoordinates[1]);
            delivery.setDeliveryLat(orderCoordinates[0]);
            delivery.setDeliveryLng(orderCoordinates[1]);
            delivery.setStatus(DeliveryStatus.ACCEPTED);

            driver.setIsAvailable(false);
            deliveryDriverRepository.save(driver);

            Customer customer = userRepository.findCustomerById(Math.toIntExact(order.getUserId()))
                    .orElseThrow(() -> new CustomException(ExceptionCode.CUSTOMER_NOT_FOUND));

            String subject = "Order Accepted";
            String message = String.format("Hi %s, your order #%d has been accepted by a driver and is on the way!",
                    customer.getFirstName(), order.getId());
            //sendEmailWithFallback(customer.getEmail(), subject, message);

            log.info("Driver {} accepted order {}", driverId, order.getId());

            deliveryRepository.save(delivery);

            DeliveryResponse response = convertToResponse(delivery);
            return ApiResponse.successResponse("Order accepted", response);

        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while accepting order: {}", e.getMessage());
            throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    @Transactional
    public ApiResponse<DeliveryResponse> completeDelivery(Long deliveryId, DeliveryCompletionRequest dto) throws CustomException {
        log.debug("Completing delivery with ID: {}", deliveryId);

        Deliveries delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new CustomException(ExceptionCode.DELIVERY_NOT_FOUND));

        DeliveryPerson driver = deliveryDriverRepository.findById((long) delivery.getDriver().getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.DRIVER_NOT_FOUND));

        Order order = orderRepository.findById(delivery.getOrder().getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));

        if (dto.isCompleted()) {
            delivery.setStatus(DeliveryStatus.DELIVERED);
            order.setStatus(OrderStatus.DELIVERED);
        } else {
            delivery.setStatus(DeliveryStatus.FAILED);
            order.setStatus(OrderStatus.DELIVERY_FAILED);
        }

        delivery.setNotes(dto.getNotes());
        delivery.setProofImage(dto.getProofImage());

        orderRepository.save(order);
        deliveryRepository.save(delivery);

        driver.setIsAvailable(true);
        deliveryDriverRepository.save(driver);

        Customer customer = userRepository.findCustomerById(Math.toIntExact(order.getUserId()))
                .orElseThrow(() -> new CustomException(ExceptionCode.CUSTOMER_NOT_FOUND));

        // Use EmailUtil
        String subject = "Order Accepted";
        String message = String.format("Hi %s, your order #%d has been delivered. Enjoy the order!",
                customer.getFirstName(), order.getId());
        //sendEmailWithFallback(customer.getEmail(), subject, message);

        DeliveryResponse response = convertToResponse(delivery);

        return ApiResponse.successResponse("Delivery completed", response);
    }

    @Override
    @Transactional
    public ApiResponse<List<DeliveryHistoryResponse>> getDeliveryHistory(Long driverId) throws CustomException {
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found for getting history", driverId);
                    return new CustomException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        List<Deliveries> deliveries = deliveryRepository.findByDriverAndStatus(driver, DeliveryStatus.DELIVERED);

        if (deliveries.isEmpty()) {
            throw new CustomException(ExceptionCode.NO_DELIVERY_HISTORY);
        }

        List<DeliveryHistoryResponse> response = deliveries.stream()
                .map(this::mapToDeliveryHistoryResponse)
                .collect(Collectors.toList());

        return ApiResponse.successResponse("Delivery history fetched", response);
    }

    @Override
    public ApiResponse<List<DeliveryResponse>> getAllDeliveries() throws CustomException {
        List<Deliveries> deliveries = deliveryRepository.findAll();

        if (deliveries.isEmpty()) {
            throw new NoContentException(ExceptionCode.NO_DELIVERY_FOUND);
        }

        List<DeliveryResponse> deliveryResponses = deliveries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ApiResponse.successResponse("Deliveries fetched", deliveryResponses);
    }

    @Override
    public ApiResponse<DeliveryResponse> getDelivery(Long deliveryId) throws CustomException {
        Deliveries delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> {
                    log.warn("Delivery with ID {} does not exists.", deliveryId);
                    return new NotFoundException(ExceptionCode.DELIVERY_NOT_FOUND);
                });

        return ApiResponse.successResponse("Delivery fetched", convertToResponse(delivery));
    }

    @Override
    @Transactional
    public ApiResponse<DeliveryResponse> getActiveDelivery(Long driverId) throws CustomException {
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found", driverId);
                    return new NotFoundException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        Deliveries delivery = deliveryRepository.findByDriverAndStatus(driver, DeliveryStatus.ACCEPTED)
                .stream()
                .findFirst()
                .orElseThrow(() -> new NoContentException(ExceptionCode.NO_ACTIVE_HISTORY));

        DeliveryResponse response = convertToResponse(delivery);
        return ApiResponse.successResponse("Active delivery fetched", response);
    }

    @Override
    @Transactional
    public ApiResponse<String> rateDelivery(Long deliveryId, DeliveryRatingRequest request) throws CustomException {
        Deliveries delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new CustomException(ExceptionCode.DELIVERY_NOT_FOUND));

        if (delivery.getStatus() != DeliveryStatus.DELIVERED) {
            throw new CustomException(ExceptionCode.DELIVERY_NOT_COMPLETED);
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new CustomException(ExceptionCode.INVALID_RATING);
        }

        delivery.setRating(request.getRating());
        delivery.setRatingComment(request.getComment());
        deliveryRepository.save(delivery);

        return ApiResponse.successResponse("Rating submitted successfully");
    }

    @Override
    public ApiResponse<List<WeeklyStatsResponse>> getWeeklyStats(Long driverId) throws CustomException {
        LocalDate startDate = LocalDate.now().minusDays(7);

        List<DeliveryRepository.WeeklyStatsProjection> projections = deliveryRepository
                .findWeeklyStatsByDriverNative(driverId, startDate);

        if (projections.isEmpty()) {
            throw new NoContentException(ExceptionCode.NO_DRIVER_STATS);
        }

        List<WeeklyStatsResponse> stats = projections.stream()
                .map(p -> new WeeklyStatsResponse(
                        p.getDay(),
                        p.getDeliveryCount(),
                        p.getTotalEarnings()))
                .collect(Collectors.toList());

        return ApiResponse.successResponse("Weekly stats fetched", stats);
    }

    @Override
    public ApiResponse<List<RatingDistributionResponse>> getRatingDistribution(Long driverId) throws CustomException {
        List<RatingDistributionResponse> distribution = deliveryRepository.findRatingDistributionByDriver(driverId);
        if (distribution.isEmpty()) {
            throw new NoContentException(ExceptionCode.NO_DRIVER_RATING);
        }
        return ApiResponse.successResponse("Rating distribution fetched", distribution);
    }

    @Override
    public ApiResponse<Double> getAverageRating(Long driverId) throws CustomException {
        Double average = deliveryRepository.findAverageRatingByDriver(driverId);
        if (average == null) {
            throw new NoContentException(ExceptionCode.NO_DRIVER_RATING);
        }
        return ApiResponse.successResponse("Average rating fetched", average);
    }

    @Override
    public ApiResponse<DeliveryResponse> getByOrderId(Long orderId) throws CustomException {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> {
            log.warn("Order with ID {} not found", orderId);
            return new NotFoundException(ExceptionCode.ORDER_NOT_FOUND);
        });
        Deliveries delivery = deliveryRepository.findByOrder(order);

        DeliveryResponse response = convertToResponse(delivery);
        return ApiResponse.successResponse("Delivery fetched", response);
    }

    private void sendEmailWithFallback(String to, String subject, String message) throws CustomException {
        try {
            if (emailUtil.isEmpty()) {
                log.warn("Email service unavailable - cannot send notification to {}", to);
                throw new CustomException(ExceptionCode.EMAIL_UNAVAILABLE);
            }
            emailUtil.get().sendEmail(to, subject, message);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", to, e.getMessage());
            throw new CustomException(ExceptionCode.EMAIL_SEND_FAILURE);
        }
    }

    private DeliveryResponse convertToResponse(Deliveries delivery) {
        DeliveryResponse response = new DeliveryResponse();
        response.setDeliveryId(delivery.getId());
        response.setOrderId(delivery.getOrder().getId());
        response.setDriverId(delivery.getDriver().getId());
        response.setStatus(delivery.getStatus().name());
        response.setNotes(delivery.getNotes());
        response.setProofImage(delivery.getProofImage());
        response.setRating(delivery.getRating());
        response.setRatingComment(delivery.getRatingComment());
        response.setCreatedAt(delivery.getCreatedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());
        response.setPickupLng(delivery.getPickupLng());
        response.setPickupLat(delivery.getPickupLat());
        response.setDeliveryLat(delivery.getDeliveryLat());
        response.setDeliveryLng(delivery.getDeliveryLng());
        return response;
    }

    private DeliveryHistoryResponse mapToDeliveryHistoryResponse(Deliveries delivery) {
        DeliveryHistoryResponse response = new DeliveryHistoryResponse();

        // Map basic delivery fields
        response.setId(delivery.getId());
        response.setPickupLat(delivery.getPickupLat());
        response.setPickupLng(delivery.getPickupLng());
        response.setDeliveryLat(delivery.getDeliveryLat());
        response.setDeliveryLng(delivery.getDeliveryLng());
        response.setStatus(delivery.getStatus().name());
        response.setNotes(delivery.getNotes());
        response.setProofImage(delivery.getProofImage());
        response.setRating(delivery.getRating());
        response.setRatingComment(delivery.getRatingComment());
        response.setCreatedAt(delivery.getCreatedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());

        // Map order details
        if (delivery.getOrder() != null) {
            response.setOrderId(delivery.getOrder().getId());
            response.setDeliveryAddress(delivery.getOrder().getDeliveryAddress());
            response.setRestaurantName(delivery.getOrder().getRestaurantName());
        }

        // Map driver details (if needed)
        if (delivery.getDriver() != null) {
            response.setDriverId((long) delivery.getDriver().getId());
            response.setDriverName(delivery.getDriver().getFirstName() + " " + delivery.getDriver().getLastName());
        }

        return response;
    }
}

