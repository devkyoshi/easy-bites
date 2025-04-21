package com.ds.orderservice.controller;

import com.ds.commons.template.ApiResponse;
import com.ds.orderservice.dto.*;
import com.ds.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.successResponse("Auth Service is up and running!");
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrder(@PathVariable Long orderId) {
        return orderService.getOrder(orderId);
    }

    @GetMapping("/users/{userId}")
    public List<OrderResponse> getUserOrders(@PathVariable Long userId) {
        return orderService.getUserOrders(userId);
    }

    @GetMapping("/users/{userId}/delivered")
    public List<OrderResponse> getUserDeliveredOrders(@PathVariable Long userId) {
        return orderService.getUserDeliveredOrders(userId);
    }

    @GetMapping("/restaurants/{restaurantId}")
    public List<OrderResponse> getRestaurantOrders(@PathVariable Long restaurantId) {
        return orderService.getRestaurantOrders(restaurantId);
    }

    @PutMapping("/{orderId}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orderService.updateOrderStatus(orderId, request);
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
    }
}