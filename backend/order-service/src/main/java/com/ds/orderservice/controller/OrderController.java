//package com.ds.orderservice.controller;
//
//import com.ds.commons.exception.CustomException;
//import com.ds.commons.template.ApiResponse;
//import com.ds.masterservice.dto.request.orderService.CreateOrderRequest;
//import com.ds.masterservice.dto.request.orderService.UpdateOrderStatusRequest;
//import com.ds.masterservice.dto.response.orderService.OrderResponse;
//import com.ds.masterservice.service.orderService.OrderServiceImpl;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/orders")
//@RequiredArgsConstructor
//public class OrderController {
//
//    private final OrderServiceImpl orderServiceImpl;
//
//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) throws CustomException {
//        return orderServiceImpl.createOrder(request);
//    }
//
//    @GetMapping("/health")
//    public ApiResponse<String> health() {
//        return ApiResponse.successResponse("Auth Service is up and running!");
//    }
//
//    @GetMapping("/{orderId}")
//    public OrderResponse getOrder(@PathVariable Long orderId) throws CustomException {
//        return orderServiceImpl.getOrder(orderId);
//    }
//
//    @GetMapping("/users/{userId}")
//    public List<OrderResponse> getUserOrders(@PathVariable Long userId) {
//        return orderServiceImpl.getUserOrders(userId);
//    }
//
//    @GetMapping("/users/{userId}/delivered")
//    public List<OrderResponse> getUserDeliveredOrders(@PathVariable Long userId) {
//        return orderServiceImpl.getUserDeliveredOrders(userId);
//    }
////
////    @GetMapping("/restaurants/{restaurantId}")
////    public List<OrderResponse> getRestaurantOrders(@PathVariable Long restaurantId) {
////        return orderService.getRestaurantOrders(restaurantId);
////    }
//
//    @PutMapping("/{orderId}/status")
//    public OrderResponse updateOrderStatus(
//            @PathVariable Long orderId,
//            @Valid @RequestBody UpdateOrderStatusRequest request) throws CustomException {
//        return orderServiceImpl.updateOrderStatus(orderId, request);
//    }
//
//    @DeleteMapping("/{orderId}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    public void deleteOrder(@PathVariable Long orderId) throws CustomException {
//        orderServiceImpl.deleteOrder(orderId);
//    }
//}