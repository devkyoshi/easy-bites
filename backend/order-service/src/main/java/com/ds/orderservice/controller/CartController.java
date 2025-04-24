package com.ds.orderservice.controller;

import com.ds.commons.template.ApiResponse;
import com.ds.orderservice.dto.*;
import com.ds.orderservice.service.CartService;
import com.ds.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;



import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse createCart(@Valid @RequestBody CreateCartRequest request) {
        return cartService.createCart(request);
    }

    @GetMapping("/{cartId}")
    public CartResponse getCart(@PathVariable("cartId") Long cartId) {
        return cartService.getCart(cartId);
    }

    @GetMapping("/users/{userId}/active")
    public CartResponse getUserActiveCart(@PathVariable("userId") Long userId) {
        return cartService.getUserActiveCart(userId);
    }

    @PutMapping("/{cartId}")
    public CartResponse updateCart(@PathVariable("cartId") Long cartId, @Valid @RequestBody UpdateCartRequest request) {
        return cartService.updateCart(cartId, request);
    }

    @DeleteMapping("/{cartId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCart(@PathVariable("cartId") Long cartId) {
        cartService.deleteCart(cartId);
    }

    @PostMapping("/{cartId}/checkout")
    public CartResponse checkoutCart(@PathVariable("cartId") Long cartId) {
        return cartService.checkoutCart(cartId);
    }

    // ➕ Add item to cart
    @PostMapping("/{cartId}/items")
    public CartResponse addItemToCart(
            @PathVariable("cartId") Long cartId,
            @Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItemToCart(cartId, request);
    }

    // 📝 Update item quantity
    @PutMapping("/{cartId}/items")
    public CartResponse updateItemQuantity(
            @PathVariable("cartId") Long cartId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateItemQuantity(cartId, request);
    }

    // ❌ Remove item from cart
    @DeleteMapping("/{cartId}/items")
    public CartResponse removeItemFromCart(
            @PathVariable("cartId") Long cartId,
            @Valid @RequestBody RemoveCartItemRequest request) {
        return cartService.removeItemFromCart(cartId, request);
    }

    @DeleteMapping("/{cartId}/items/decrement")
    public CartResponse removeOrDecrementItem(
            @PathVariable("cartId") Long cartId,
            @Valid @RequestBody RemoveOrDecrementItemRequest request) {
        return cartService.removeOrDecrementItem(cartId, request);
    }
    @DeleteMapping("/{cartId}/clear")
    public CartResponse clearCart(@PathVariable("cartId") Long cartId) {
        return cartService.clearCart(cartId);
    }
    // Add this new endpoint
    @PostMapping("/add-or-create")
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse addOrCreateCart(@Valid @RequestBody AddOrCreateCartRequest request) {
        return cartService.addOrCreateCart(request);
    }

    //orderrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
    private final OrderService orderService;

    @PostMapping("/order")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.successResponse("Auth Service is up and running!");
    }

    @GetMapping("/order/{orderId}")
    public OrderResponse getOrder(@PathVariable("orderId") Long orderId) {
        return orderService.getOrder(orderId);
    }

    @GetMapping("/users/{userId}")
    public List<OrderResponse> getUserOrders(@PathVariable("userId") Long userId) {
        return orderService.getUserOrders(userId);
    }

    @GetMapping("/users/{userId}/delivered")
    public List<OrderResponse> getUserDeliveredOrders(@PathVariable("userId") Long userId) {
        return orderService.getUserDeliveredOrders(userId);
    }

    @GetMapping("/restaurants/{restaurantId}")
    public List<OrderResponse> getRestaurantOrders(@PathVariable("restaurantId") Long restaurantId) {
        return orderService.getRestaurantOrders(restaurantId);
    }

    @PutMapping("/{orderId}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable("orderId") Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orderService.updateOrderStatus(orderId, request);
    }

    @DeleteMapping("/order/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable("orderId") Long orderId) {
        orderService.deleteOrder(orderId);
    }

    @GetMapping("/users/{userId}/bills")
    public List<BillResponse> getUserPaidBills(@PathVariable("userId") Long userId) {
        return orderService.getUserPaidBills(userId);
    }

    @PutMapping("/{orderId}/payment-status")
    public OrderResponse updatePaymentStatus(
            @PathVariable("orderId") Long orderId,
            @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return orderService.updatePaymentStatus(orderId, request.getPaymentStatus());
    }

    @PutMapping("/{orderId}/cancel")
    public OrderResponse cancelPendingOrder(@PathVariable("orderId") Long orderId) {
        return orderService.cancelOrderIfPending(orderId);
    }

}
