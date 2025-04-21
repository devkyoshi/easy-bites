package com.ds.orderservice.service;

import com.ds.orderservice.dao.*;
import com.ds.orderservice.dto.*;
import com.ds.orderservice.repository.CartRepository;
import com.ds.orderservice.repository.OrderRepository;
import com.ds.orderservice.utils.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;


    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        Logger logger = LoggerFactory.getLogger(getClass());
        logger.debug("Starting createOrder for cartId: {}", request.getCartId());

        // Get the checked out cart
        Cart cart = cartRepository.findById(request.getCartId())
                .orElseThrow(() -> {
                    logger.error("Cart not found with id: {}", request.getCartId());
                    return new ResourceNotFoundException("Cart not found with id: " + request.getCartId());
                });

        logger.debug("Cart retrieved: id={}, status={}, userId={}",
                cart.getId(), cart.getStatus(), cart.getUserId());

        if (cart.getStatus() != CartStatus.CHECKED_OUT) {
            logger.error("Attempted to create order from cart with status: {}", cart.getStatus());
            throw new IllegalStateException("Cannot create order from a cart that is not checked out");
        }

        // Convert cart to order
        Order order = new Order();
        order.setUserId(cart.getUserId());
        order.setRestaurantId(cart.getRestaurantId());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setTotalAmount(cart.getTotalAmount());

        logger.debug("Creating order for userId={}, restaurantId={}, totalAmount={}",
                cart.getUserId(), cart.getRestaurantId(), cart.getTotalAmount());

        // Convert cart items to order items
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setItemId(cartItem.getItemId());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setUnitPrice(cartItem.getUnitPrice());
                    orderItem.setTotalPrice(cartItem.getTotalPrice());

                    logger.debug("Adding order item: itemId={}, quantity={}, unitPrice={}, totalPrice={}",
                            cartItem.getItemId(), cartItem.getQuantity(), cartItem.getUnitPrice(), cartItem.getTotalPrice());

                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        logger.debug("Order saved successfully with id: {}", savedOrder.getId());

        return mapToOrderResponse(savedOrder);
    }
    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getUserDeliveredOrders(Long userId) {
        return orderRepository.findByUserIdAndStatus(userId, OrderStatus.DELIVERED).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        try {
            OrderStatus newStatus = OrderStatus.valueOf(request.getStatus());
            order.setStatus(newStatus);
            order.setUpdatedAt(LocalDateTime.now());
            return mapToOrderResponse(orderRepository.save(order));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + request.getStatus());
        }
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        orderRepository.delete(order);
    }
    public List<BillResponse> getUserPaidBills(Long userId) {
        return orderRepository.findByUserIdAndPaymentStatus(userId, PaymentStatus.PAID).stream()
                .map(this::mapToBillResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updatePaymentStatus(Long orderId, PaymentStatus paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setPaymentStatus(paymentStatus);
        order.setUpdatedAt(LocalDateTime.now());
        return mapToOrderResponse(orderRepository.save(order));
    }

    private BillResponse mapToBillResponse(Order order) {
        BillResponse response = new BillResponse();
        response.setOrderId(order.getId());
        response.setUserId(order.getUserId());
        response.setRestaurantId(order.getRestaurantId());
        response.setTotalAmount(order.getTotalAmount());
        response.setPaymentStatus(order.getPaymentStatus().toString());
        response.setCreatedAt(order.getCreatedAt());

        // You can set these if you have the information
        response.setBillingAddress(order.getDeliveryAddress()); // Using delivery as billing address
        // response.setPaymentMethod("Credit Card"); // If you track payment methods

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> {
                    OrderItemResponse itemResponse = new OrderItemResponse();
                    itemResponse.setItemId(item.getItemId());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setUnitPrice(item.getUnitPrice());
                    itemResponse.setTotalPrice(item.getTotalPrice());
                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(itemResponses);
        return response;
    }
    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setRestaurantId(order.getRestaurantId());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus().toString());
        response.setPaymentStatus(order.getPaymentStatus().toString());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> {
                    OrderItemResponse itemResponse = new OrderItemResponse();
                    itemResponse.setItemId(item.getItemId());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setUnitPrice(item.getUnitPrice());
                    itemResponse.setTotalPrice(item.getTotalPrice());
                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(itemResponses);
        return response;
    }
}