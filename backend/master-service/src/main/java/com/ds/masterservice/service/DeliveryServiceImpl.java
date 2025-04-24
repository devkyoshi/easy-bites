package com.ds.masterservice.service;

import com.ds.commons.enums.DeliveryStatus;
import com.ds.commons.enums.OrderStatus;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;
import com.ds.commons.utils.GeoUtils;
import com.ds.commons.utils.GeocodingUtil;
import com.ds.masterservice.dao.*;
import com.ds.masterservice.dto.request.DeliveryAcceptanceRequest;
import com.ds.masterservice.dto.request.DeliveryCompletionRequest;
import com.ds.masterservice.dto.response.DeliveryResponse;
import com.ds.masterservice.dto.response.OrderResponse;
import com.ds.masterservice.repository.*;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
public class DeliveryServiceImpl implements DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final DeliveryDriverRepository deliveryDriverRepository;
    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final GeocodingUtil geocodingUtil;
    private final EmailUtil emailUtil;
    private final Set<Long> notifiedOrderIds = new HashSet<>();
    private static final double DELIVERY_RADIUS_KM = 5.0;

    @Autowired
    public DeliveryServiceImpl(DeliveryRepository deliveryRepository, DeliveryDriverRepository deliveryDriverRepository, OrderRepository orderRepository, RestaurantRepository restaurantRepository, UserRepository userRepository, GeocodingUtil geocodingUtil ) {
        this.deliveryRepository = deliveryRepository;
        this.deliveryDriverRepository = deliveryDriverRepository;
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
        this.geocodingUtil = geocodingUtil;
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

            List<OrderResponse> orders = orderRepository.findByStatus(OrderStatus.RESTAURANT_ACCEPTED);
            List<OrderResponse> nearbyOrders = new ArrayList<>();

            for (OrderResponse order : orders) {
                try {
                    BigDecimal[] coordinates = geocodingUtil.getCoordinates(order.getDeliveryAddress());

                    double distance = GeoUtils.calculateDistance(
                            lat,
                            lng,
                            coordinates[0],
                            coordinates[1]
                    );
                    if (distance <= DELIVERY_RADIUS_KM) {
                        nearbyOrders.add(order);
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

    public ApiResponse<String> notifyNearbyDriversForNewOrder(Long orderId) throws CustomException {
        try {
            var order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));

            if (notifiedOrderIds.contains(orderId)) {
                log.debug("Order ID {} already notified", orderId);
                return ApiResponse.successResponse("Drivers already notified for this order");
            }

            BigDecimal[] orderCoords = geocodingUtil.getCoordinates(order.getDeliveryAddress());
            List<DeliveryPerson> drivers = deliveryDriverRepository.findByAvailable(true);

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

                    emailUtil.sendEmail(driver.getEmail(), subject, message);
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

            Restaurant restaurant = restaurantRepository.findById(order.getRestaurantId())
                    .orElseThrow(() -> new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND));

            boolean alreadyAssigned = deliveryRepository.existsByOrderAndStatusIn(
                    order, List.of(DeliveryStatus.ACCEPTED, DeliveryStatus.ACCEPTED)
            );

            if (alreadyAssigned) {
                log.error("Order {} is already in progress.", dto.getOrderId());
                throw new CustomException(ExceptionCode.DRIVER_ACCEPTED_ORDER);
            }

            order.setStatus(OrderStatus.DRIVER_ASSIGNED);
            orderRepository.save(order);

            BigDecimal[] orderCoordinates = geocodingUtil.getCoordinates(order.getDeliveryAddress());
            BigDecimal[] restaurantCoordinates = geocodingUtil.getCoordinates(restaurant.getAddress());

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

            // Use EmailUtil
            String subject = "Order Accepted";
            String message = String.format("Hi %s, your order #%d has been accepted by a driver and is on the way!",
                    customer.getFirstName(), order.getId());
            emailUtil.sendEmail(customer.getEmail(), subject, message);

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
        emailUtil.sendEmail(customer.getEmail(), subject, message);

        DeliveryResponse response = convertToResponse(delivery);

        return ApiResponse.successResponse("Delivery completed", response);
    }

    @Override
    @Transactional
    public ApiResponse<List<Deliveries>> getDeliveryHistory(Long driverId) throws CustomException {
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found for getting history", driverId);
                    return new CustomException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        List<Deliveries> deliveries = deliveryRepository.findByDriverAndStatus(driver, DeliveryStatus.DELIVERED);

        if (deliveries.isEmpty()) {
            throw new CustomException(ExceptionCode.NO_DELIVERY_HISTORY);
        }

        return ApiResponse.successResponse("Delivery history fetched", deliveries);
    }

    @Override
    @Transactional
    public ApiResponse<DeliveryResponse> getActiveDelivery(Long driverId) throws CustomException {
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} has no active delivery", driverId);
                    return new CustomException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        Deliveries delivery = deliveryRepository.findByDriverAndStatus(driver, DeliveryStatus.ACCEPTED)
                .stream()
                .findFirst()
                .orElseThrow(() -> new CustomException(ExceptionCode.NO_ACTIVE_HISTORY));

        DeliveryResponse response = convertToResponse(delivery);

        return ApiResponse.successResponse("Active delivery fetched", response);
    }

    private DeliveryResponse convertToResponse(Deliveries delivery) {
        DeliveryResponse response = new DeliveryResponse();
        response.setDeliveryId(delivery.getId());
        response.setOrderId(delivery.getOrder().getId());
        response.setDriverId(delivery.getDriver().getId());
        response.setStatus(delivery.getStatus().name());
        response.setNotes(delivery.getNotes());
        response.setProofImage(delivery.getProofImage());
        return response;
    }
}

