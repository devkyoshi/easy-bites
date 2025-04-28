package com.ds.orderservice.controller;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dto.request.orderService.*;
import com.ds.masterservice.dto.response.orderService.BillResponse;
import com.ds.masterservice.dto.response.orderService.CartResponse;
import com.ds.masterservice.dto.response.orderService.OrderResponse;
import com.ds.masterservice.service.orderService.CartServiceImpl;
import com.ds.masterservice.service.orderService.OrderServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;



import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class CartController {

    private final CartServiceImpl cartServiceImpl;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse createCart(@Valid @RequestBody CreateCartRequest request) {
        return cartServiceImpl.createCart(request);
    }

    @GetMapping("/{cartId}")
    public CartResponse getCart(@PathVariable("cartId") Long cartId) throws CustomException {
        return cartServiceImpl.getCart(cartId);
    }

    @GetMapping("/users/{userId}/active")
    public CartResponse getUserActiveCart(@PathVariable("userId") Long userId) throws CustomException {
        return cartServiceImpl.getUserActiveCart(userId);
    }

    @PutMapping("/{cartId}")
    public CartResponse updateCart(@PathVariable("cartId") Long cartId, @Valid @RequestBody UpdateCartRequest request) throws CustomException {
        return cartServiceImpl.updateCart(cartId, request);
    }

    @DeleteMapping("/{cartId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCart(@PathVariable("cartId") Long cartId) throws CustomException {
        cartServiceImpl.deleteCart(cartId);
    }

    @PostMapping("/{cartId}/checkout")
    public CartResponse checkoutCart(@PathVariable("cartId") Long cartId) throws CustomException {
        return cartServiceImpl.checkoutCart(cartId);
    }

    // ➕ Add item to cart
    @PostMapping("/{cartId}/items")
    public CartResponse addItemToCart(
            @PathVariable("cartId") Long cartId,
            @Valid @RequestBody AddCartItemRequest request) throws CustomException {
        return cartServiceImpl.addItemToCart(cartId, request);
    }

    // 📝 Update item quantity
    @PutMapping("/{cartId}/items")
    public CartResponse updateItemQuantity(
            @PathVariable("cartId") Long cartId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return cartServiceImpl.updateItemQuantity(cartId, request);
    }

    // ❌ Remove item from cart
    @DeleteMapping("/{cartId}/items")
    public CartResponse removeItemFromCart(
            @PathVariable("cartId") Long cartId,
            @Valid @RequestBody RemoveCartItemRequest request) throws CustomException {
        return cartServiceImpl.removeItemFromCart(cartId, request);
    }

    @DeleteMapping("/{cartId}/items/decrement")
    public CartResponse removeOrDecrementItem(
            @PathVariable("cartId") Long cartId,
            @Valid @RequestBody RemoveOrDecrementItemRequest request) throws CustomException {
        return cartServiceImpl.removeOrDecrementItem(cartId, request);
    }
    @DeleteMapping("/{cartId}/clear")
    public CartResponse clearCart(@PathVariable("cartId") Long cartId) throws CustomException {
        return cartServiceImpl.clearCart(cartId);
    }
    // Add this new endpoint
    @PostMapping("/add-or-create")
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse addOrCreateCart(@Valid @RequestBody AddOrCreateCartRequest request) {
        return cartServiceImpl.addOrCreateCart(request);
    }

    //orderrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
    private final OrderServiceImpl orderServiceImpl;

    @PostMapping("/order")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) throws CustomException {
        return orderServiceImpl.createOrder(request);
    }

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.successResponse("Auth Service is up and running!");
    }

    @GetMapping("/order/{orderId}")
    public OrderResponse getOrder(@PathVariable("orderId") Long orderId) throws CustomException {
        return orderServiceImpl.getOrder(orderId);
    }

    @GetMapping("/users/{userId}")
    public List<OrderResponse> getUserOrders(@PathVariable("userId") Long userId) {
        return orderServiceImpl.getUserOrders(userId);
    }

    @GetMapping("/users/{userId}/delivered")
    public List<OrderResponse> getUserDeliveredOrders(@PathVariable("userId") Long userId) {
        return orderServiceImpl.getUserDeliveredOrders(userId);
    }

//    @GetMapping("/restaurants/{restaurantId}")
//    public List<OrderResponse> getRestaurantOrders(@PathVariable("restaurantId") Long restaurantId) {
//        return orderService.getRestaurantOrders(restaurantId);
//    }

    @PutMapping("/{orderId}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable("orderId") Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) throws CustomException {
        return orderServiceImpl.updateOrderStatus(orderId, request);
    }

    @DeleteMapping("/order/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable("orderId") Long orderId) throws CustomException {
        orderServiceImpl.deleteOrder(orderId);
    }

    @GetMapping("/users/{userId}/bills")
    public List<BillResponse> getUserPaidBills(@PathVariable("userId") Long userId) {
        return orderServiceImpl.getUserPaidBills(userId);
    }

    @PutMapping("/{orderId}/payment-status")
    public OrderResponse updatePaymentStatus(
            @PathVariable("orderId") Long orderId,
            @Valid @RequestBody UpdatePaymentStatusRequest request) throws CustomException {
        return orderServiceImpl.updatePaymentStatus(orderId, request.getPaymentStatus());
    }

    @PutMapping("/{orderId}/cancel")
    public OrderResponse cancelPendingOrder(@PathVariable("orderId") Long orderId) throws CustomException {
        return orderServiceImpl.cancelOrderIfPending(orderId);
    }

}
