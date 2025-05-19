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
import com.ds.masterservice.dao.authService.Customer;
import com.ds.masterservice.dao.deliveryService.Deliveries;
import com.ds.masterservice.dao.deliveryService.DeliveryPerson;
import com.ds.masterservice.dao.orderService.Order;
import com.ds.masterservice.dao.orderService.OrderStatus;
import com.ds.masterservice.dao.restaurantService.Restaurant;
import com.ds.masterservice.dto.request.deliveryService.DeliveryAcceptanceRequest;
import com.ds.masterservice.dto.request.deliveryService.DeliveryCompletionRequest;
import com.ds.masterservice.dto.request.deliveryService.DeliveryRatingRequest;
import com.ds.masterservice.dto.response.deliveryService.DeliveryHistoryResponse;
import com.ds.masterservice.dto.response.deliveryService.DeliveryResponse;
import com.ds.masterservice.dto.response.RatingDistributionResponse;
import com.ds.masterservice.dto.response.WeeklyStatsResponse;
import com.ds.masterservice.dto.response.orderService.OrderItemResponse;
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
    // Repositories for data access
    private final DeliveryRepository deliveryRepository;
    private final DeliveryDriverRepository deliveryDriverRepository;
    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    // Optional utilities (may not be available)
    @Autowired(required = false)
    private Optional<GeocodingUtil> geocodingUtil;
    @Autowired(required = false)
    private Optional<EmailUtil> emailUtil;

    // Track which orders have been notified to prevent duplicate notifications
    private final Set<Long> notifiedOrderIds = new HashSet<>();

    // Maximum delivery radius in kilometers
    private static final double DELIVERY_RADIUS_KM = 55.0;

    /**
     * Constructor for dependency injection.
     *
     * @param deliveryRepository repository for delivery operations
     * @param deliveryDriverRepository repository for driver operations
     * @param orderRepository repository for order operations
     * @param restaurantRepository repository for restaurant operations
     * @param userRepository repository for user operations
     */
    @Autowired
    public DeliveryServiceImpl(DeliveryRepository deliveryRepository,
                               DeliveryDriverRepository deliveryDriverRepository,
                               OrderRepository orderRepository,
                               RestaurantRepository restaurantRepository,
                               UserRepository userRepository) {
        this.deliveryRepository = deliveryRepository;
        this.deliveryDriverRepository = deliveryDriverRepository;
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    /**
     * Retrieves nearby orders for a driver based on their current location.
     *
     * @param driverId ID of the driver
     * @param lat current latitude of the driver
     * @param lng current longitude of the driver
     * @return ApiResponse containing list of nearby orders
     * @throws CustomException if driver not found or geocoding fails
     */
    @Override
    public ApiResponse<List<OrderResponse>> getNearbyOrders(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException {
        try {
            log.debug("Fetching nearby orders for driverId: {}", driverId);

            // Find driver and update their current location
            DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.DRIVER_NOT_FOUND));

            driver.setCurrentLat(lat);
            driver.setCurrentLng(lng);
            deliveryDriverRepository.save(driver);

            // Get all orders in RESTAURANT_ACCEPTED status
            List<Order> orders = orderRepository.findByStatus(OrderStatus.RESTAURANT_ACCEPTED);

            List<OrderResponse> nearbyOrders = new ArrayList<>();

            log.debug("Found {} orders in RESTAURANT_ACCEPTED status", orders.size());
            for (Order order : orders) {
                try {
                    // Convert delivery address to coordinates
                    BigDecimal[] coordinates = geocodingUtil
                            .orElseThrow(() -> new CustomException(ExceptionCode.GEOCODING_UNAVAILABLE))
                            .getCoordinates(order.getDeliveryAddress());
                    log.debug("Order {} address {} converted to coordinates: {}, {}",
                            order.getId(), order.getDeliveryAddress(), coordinates[0], coordinates[1]);

                    // Calculate distance between driver and order
                    double distance = GeoUtils.calculateDistance(
                            lat,
                            lng,
                            coordinates[0],
                            coordinates[1]
                    );
                    log.debug("Distance for order {}: {} km (radius: {} km)",
                            order.getId(), distance, DELIVERY_RADIUS_KM);

                    // Add to nearby orders if within radius
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

    /**
     * Converts an Order entity to an OrderResponse DTO.
     *
     * @param order the order entity to convert
     * @return converted OrderResponse
     */

    private OrderResponse convertOrderToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setPaymentStatus(order.getPaymentStatus().toString());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> {
                    OrderItemResponse itemResponse = new OrderItemResponse();
                    itemResponse.setItemId(item.getItemId());
                    itemResponse.setItemName(item.getItemName());
                    itemResponse.setItemImage(item.getItemImage());
                    itemResponse.setRestaurantName(item.getRestaurantName());
                    itemResponse.setRestaurantId(item.getRestaurantId());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setUnitPrice(item.getUnitPrice());
                    itemResponse.setTotalPrice(item.getTotalPrice());
                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(itemResponses);
        return response;
    }
//    private OrderResponse convertOrderToResponse(Order order) {
//        OrderResponse response = new OrderResponse();
//        response.setId(order.getId());
//        response.setUserId(order.getUserId());
//        //response.setItems(order.getItems());
//        response.setTotalAmount(order.getTotalAmount());
//        response.setStatus(order.getStatus());
//        response.setPaymentStatus(String.valueOf(order.getPaymentStatus()));
//        response.setDeliveryAddress(order.getDeliveryAddress());
//        response.setCreatedAt(order.getCreatedAt());
//        response.setUpdatedAt(order.getUpdatedAt());
//        return response;
//    }

    /**
     * Notifies nearby available drivers about a new order.
     *
     * @param orderId ID of the order to notify about
     * @return ApiResponse indicating success or failure
     * @throws CustomException if order not found or geocoding fails
     */
    public ApiResponse<String> notifyNearbyDriversForNewOrder(Long orderId) throws CustomException {
        try {
            var order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));

            // Check if already notified
            if (notifiedOrderIds.contains(orderId)) {
                log.debug("Order ID {} already notified", orderId);
                return ApiResponse.successResponse("Drivers already notified for this order");
            }

            // Get coordinates for order delivery address
            BigDecimal[] orderCoords = geocodingUtil
                    .orElseThrow(() -> new CustomException(ExceptionCode.GEOCODING_UNAVAILABLE))
                    .getCoordinates(order.getDeliveryAddress());

            // Find all available drivers
            List<DeliveryPerson> drivers = deliveryDriverRepository.findByIsAvailable(true);

            int notifiedCount = 0;

            // Notify drivers within radius
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

    /**
     * Allows a driver to accept an order.
     *
     * @param driverId ID of the driver accepting the order
     * @param dto request containing order ID
     * @return ApiResponse with delivery details
     * @throws CustomException if driver/order not found or validation fails
     */
    @Override
    @Transactional
    public ApiResponse<DeliveryResponse> acceptOrder(Long driverId, DeliveryAcceptanceRequest dto) throws CustomException {
        try {
            log.debug("Driver {} attempting to accept order {}", driverId, dto.getOrderId());

            // Verify driver exists and is available
            DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.DRIVER_NOT_FOUND));

            if (!driver.getIsAvailable()) {
                log.error("Driver {} is not available", driverId);
                throw new CustomException(ExceptionCode.DRIVER_NOT_AVAILABLE);
            }

            // Verify order exists
            Order order = orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));

            // Get restaurant from first order item
            if (order.getItems() == null || order.getItems().isEmpty()) {
                throw new CustomException(ExceptionCode.ORDER_ITEM_NOT_FOUND);
            }

            Long restaurantId = order.getItems().getFirst().getRestaurantId();
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND));

            // Check if order is already assigned
            boolean alreadyAssigned = deliveryRepository.existsByOrderAndStatusIn(
                    order, List.of(DeliveryStatus.ACCEPTED)
            );

            if (alreadyAssigned) {
                log.error("Order {} is already in progress.", dto.getOrderId());
                throw new CustomException(ExceptionCode.DRIVER_ACCEPTED_ORDER);
            }

            // Get coordinates for order and restaurant
            BigDecimal[] orderCoordinates = geocodingUtil
                    .orElseThrow(() -> new CustomException(ExceptionCode.GEOCODING_UNAVAILABLE))
                    .getCoordinates(order.getDeliveryAddress());

            BigDecimal[] restaurantCoordinates = geocodingUtil
                    .orElseThrow(() -> new CustomException(ExceptionCode.GEOCODING_UNAVAILABLE))
                    .getCoordinates(restaurant.getAddress());

            // Create new delivery record
            Deliveries delivery = new Deliveries();
            delivery.setOrder(order);
            delivery.setDriver(driver);
            delivery.setPickupLat(restaurantCoordinates[0]);
            delivery.setPickupLng(restaurantCoordinates[1]);
            delivery.setDeliveryLat(orderCoordinates[0]);
            delivery.setDeliveryLng(orderCoordinates[1]);
            delivery.setStatus(DeliveryStatus.ACCEPTED);

            // Mark driver as unavailable
            driver.setIsAvailable(false);
            deliveryDriverRepository.save(driver);

            // Update order status
            order.setStatus(OrderStatus.DRIVER_ASSIGNED);
            orderRepository.save(order);

            // Notify customer
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

    /**
     * Completes or fails a delivery.
     *
     * @param deliveryId ID of the delivery to complete
     * @param dto request containing completion details
     * @return ApiResponse with delivery details
     * @throws CustomException if delivery/driver/order not found
     */
    @Override
    @Transactional
    public ApiResponse<DeliveryResponse> completeDelivery(Long deliveryId, DeliveryCompletionRequest dto) throws CustomException {
        log.debug("Completing delivery with ID: {}", deliveryId);

        // Verify delivery exists
        Deliveries delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new CustomException(ExceptionCode.DELIVERY_NOT_FOUND));

        // Verify driver exists
        DeliveryPerson driver = deliveryDriverRepository.findById((long) delivery.getDriver().getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.DRIVER_NOT_FOUND));

        // Verify order exists
        Order order = orderRepository.findById(delivery.getOrder().getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));

        // Update status based on completion flag
        if (dto.isCompleted()) {
            delivery.setStatus(DeliveryStatus.DELIVERED);
            order.setStatus(OrderStatus.DELIVERED);
        } else {
            delivery.setStatus(DeliveryStatus.FAILED);
            order.setStatus(OrderStatus.DELIVERY_FAILED);
        }

        // Set additional details
        delivery.setNotes(dto.getNotes());
        delivery.setProofImage(dto.getProofImage());

        // Save updates
        orderRepository.save(order);
        deliveryRepository.save(delivery);

        // Mark driver as available again
        driver.setIsAvailable(true);
        deliveryDriverRepository.save(driver);

        // Notify customer
        Customer customer = userRepository.findCustomerById(Math.toIntExact(order.getUserId()))
                .orElseThrow(() -> new CustomException(ExceptionCode.CUSTOMER_NOT_FOUND));

        String subject = "Order Accepted";
        String message = String.format("Hi %s, your order #%d has been delivered. Enjoy the order!",
                customer.getFirstName(), order.getId());
        //sendEmailWithFallback(customer.getEmail(), subject, message);

        DeliveryResponse response = convertToResponse(delivery);

        return ApiResponse.successResponse("Delivery completed", response);
    }

    /**
     * Retrieves delivery history for a driver.
     *
     * @param driverId ID of the driver
     * @return ApiResponse with list of delivery history items
     * @throws CustomException if driver not found or no history exists
     */
    @Override
    @Transactional
    public ApiResponse<List<DeliveryHistoryResponse>> getDeliveryHistory(Long driverId) throws CustomException {
        // Verify driver exists
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found for getting history", driverId);
                    return new CustomException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        // Get completed deliveries
        List<Deliveries> deliveries = deliveryRepository.findByDriverAndStatus(driver, DeliveryStatus.DELIVERED);

        if (deliveries.isEmpty()) {
            throw new CustomException(ExceptionCode.NO_DELIVERY_HISTORY);
        }

        // Convert to response DTOs
        List<DeliveryHistoryResponse> response = deliveries.stream()
                .map(this::mapToDeliveryHistoryResponse)
                .collect(Collectors.toList());

        return ApiResponse.successResponse("Delivery history fetched", response);
    }

    /**
     * Retrieves all deliveries in the system.
     *
     * @return ApiResponse with list of all deliveries
     * @throws CustomException if no deliveries found
     */
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

    /**
     * Retrieves a specific delivery by ID.
     *
     * @param deliveryId ID of the delivery to retrieve
     * @return ApiResponse with delivery details
     * @throws CustomException if delivery not found
     */
    @Override
    public ApiResponse<DeliveryResponse> getDelivery(Long deliveryId) throws CustomException {
        Deliveries delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> {
                    log.warn("Delivery with ID {} does not exists.", deliveryId);
                    return new NotFoundException(ExceptionCode.DELIVERY_NOT_FOUND);
                });

        return ApiResponse.successResponse("Delivery fetched", convertToResponse(delivery));
    }

    /**
     * Retrieves the active delivery for a driver.
     *
     * @param driverId ID of the driver
     * @return ApiResponse with active delivery details
     * @throws CustomException if driver not found or no active delivery
     */
    @Override
    @Transactional
    public ApiResponse<DeliveryResponse> getActiveDelivery(Long driverId) throws CustomException {
        // Verify driver exists
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found", driverId);
                    return new NotFoundException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        // Find first accepted delivery
        Deliveries delivery = deliveryRepository.findByDriverAndStatus(driver, DeliveryStatus.ACCEPTED)
                .stream()
                .findFirst()
                .orElseThrow(() -> new NoContentException(ExceptionCode.NO_ACTIVE_HISTORY));

        DeliveryResponse response = convertToResponse(delivery);
        return ApiResponse.successResponse("Active delivery fetched", response);
    }

    /**
     * Submits a rating for a completed delivery.
     *
     * @param deliveryId ID of the delivery to rate
     * @param request rating details
     * @return ApiResponse indicating success
     * @throws CustomException if delivery not found, not completed, or invalid rating
     */
    @Override
    @Transactional
    public ApiResponse<String> rateDelivery(Long deliveryId, DeliveryRatingRequest request) throws CustomException {
        // Verify delivery exists
        Deliveries delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new CustomException(ExceptionCode.DELIVERY_NOT_FOUND));

        // Verify delivery is completed
        if (delivery.getStatus() != DeliveryStatus.DELIVERED) {
            throw new CustomException(ExceptionCode.DELIVERY_NOT_COMPLETED);
        }

        // Validate rating
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new CustomException(ExceptionCode.INVALID_RATING);
        }

        // Update rating
        delivery.setRating(request.getRating());
        delivery.setRatingComment(request.getComment());
        deliveryRepository.save(delivery);

        return ApiResponse.successResponse("Rating submitted successfully");
    }

    /**
     * Retrieves weekly statistics for a driver.
     *
     * @param driverId ID of the driver
     * @return ApiResponse with weekly stats
     * @throws CustomException if driver not found or no stats available
     */
    @Override
    public ApiResponse<List<WeeklyStatsResponse>> getWeeklyStats(Long driverId) throws CustomException {
        LocalDate startDate = LocalDate.now().minusDays(7);

        // Get stats from repository
        List<DeliveryRepository.WeeklyStatsProjection> projections = deliveryRepository
                .findWeeklyStatsByDriverNative(driverId, startDate);

        if (projections.isEmpty()) {
            throw new NoContentException(ExceptionCode.NO_DRIVER_STATS);
        }

        // Convert to response DTOs
        List<WeeklyStatsResponse> stats = projections.stream()
                .map(p -> new WeeklyStatsResponse(
                        p.getDay(),
                        p.getDeliveryCount(),
                        p.getTotalEarnings()))
                .collect(Collectors.toList());

        return ApiResponse.successResponse("Weekly stats fetched", stats);
    }

    /**
     * Retrieves rating distribution for a driver.
     *
     * @param driverId ID of the driver
     * @return ApiResponse with rating distribution
     * @throws CustomException if driver not found or no ratings available
     */
    @Override
    public ApiResponse<List<RatingDistributionResponse>> getRatingDistribution(Long driverId) throws CustomException {
        List<RatingDistributionResponse> distribution = deliveryRepository.findRatingDistributionByDriver(driverId);
        if (distribution.isEmpty()) {
            throw new NoContentException(ExceptionCode.NO_DRIVER_RATING);
        }
        return ApiResponse.successResponse("Rating distribution fetched", distribution);
    }

    /**
     * Retrieves average rating for a driver.
     *
     * @param driverId ID of the driver
     * @return ApiResponse with average rating
     * @throws CustomException if driver not found or no ratings available
     */
    @Override
    public ApiResponse<Double> getAverageRating(Long driverId) throws CustomException {
        Double average = deliveryRepository.findAverageRatingByDriver(driverId);
        if (average == null) {
            throw new NoContentException(ExceptionCode.NO_DRIVER_RATING);
        }
        return ApiResponse.successResponse("Average rating fetched", average);
    }

    /**
     * Retrieves delivery information using the associated order ID.
     *
     * @param orderId unique identifier of the order
     * @return ApiResponse containing the related DeliveryResponse
     * @throws CustomException if delivery is not found
     */
    @Override
    public ApiResponse<DeliveryResponse> getByOrderId(Long orderId) throws CustomException {
        // Verify order exists
        Order order = orderRepository.findById(orderId).orElseThrow(() -> {
            log.warn("Order with ID {} not found", orderId);
            return new NotFoundException(ExceptionCode.ORDER_NOT_FOUND);
        });

        // Get associated delivery
        Deliveries delivery = deliveryRepository.findByOrder(order);

        DeliveryResponse response = convertToResponse(delivery);
        return ApiResponse.successResponse("Delivery fetched", response);
    }

    /**
     * Sends an email with fallback handling if email service is unavailable.
     *
     * @param to recipient email address
     * @param subject email subject
     * @param message email content
     * @throws CustomException if email service unavailable or sending fails
     */
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

    /**
     * Converts a Deliveries entity to a DeliveryResponse DTO.
     *
     * @param delivery the delivery entity to convert
     * @return converted DeliveryResponse
     */
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

    /**
     * Converts a Deliveries entity to a DeliveryHistoryResponse DTO.
     *
     * @param delivery the delivery entity to convert
     * @return converted DeliveryHistoryResponse
     */
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

        // Map driver details
        if (delivery.getDriver() != null) {
            response.setDriverId((long) delivery.getDriver().getId());
            response.setDriverName(delivery.getDriver().getFirstName() + " " + delivery.getDriver().getLastName());
        }

        return response;
    }
}

