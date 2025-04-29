package com.ds.masterservice.service.orderService;

import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.masterservice.dao.orderService.*;
import com.ds.masterservice.dto.request.orderService.CreateOrderRequest;
import com.ds.masterservice.dto.request.orderService.UpdateOrderStatusRequest;
import com.ds.masterservice.dto.response.orderService.BillResponse;
import com.ds.masterservice.dto.response.orderService.OrderItemResponse;
import com.ds.masterservice.dto.response.orderService.OrderResponse;
import com.ds.masterservice.repository.orderService.CartRepository;
import com.ds.masterservice.repository.orderService.OrderRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartServiceImpl cartServiceImpl;


    // Creates an order from a checked-out cart
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) throws CustomException {
        Logger logger = LoggerFactory.getLogger(getClass());
        logger.debug("Starting createOrder for cartId: {}", request.getCartId());

        // Fetch cart by ID
        Cart cart = cartRepository.findById(request.getCartId())
                .orElseThrow(() -> {
                    logger.error("Cart not found with id: {}", request.getCartId());
                    return new CustomException(ExceptionCode.CART_NOT_FOUND);
                });

        logger.debug("Cart retrieved: id={}, status={}, userId={}",
                cart.getId(), cart.getStatus(), cart.getUserId());

        // Ensure the cart is already checked out
        if (cart.getStatus() != CartStatus.CHECKED_OUT) {
            logger.error("Attempted to create order from cart with status: {}", cart.getStatus());
            throw new IllegalStateException("Cannot create order from a cart that is not checked out");
        }

        // Convert cart to order entity
        Order order = new Order();
        order.setUserId(cart.getUserId());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setTotalAmount(cart.getTotalAmount());

        // Convert cart items into order items
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setItemId(cartItem.getItemId());
                    orderItem.setItemName(cartItem.getItemName());
                    orderItem.setItemImage(cartItem.getItemImage());
                    orderItem.setRestaurantName(cartItem.getRestaurantName());
                    orderItem.setRestaurantId(cartItem.getRestaurantId());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setUnitPrice(cartItem.getUnitPrice());
                    orderItem.setTotalPrice(cartItem.getTotalPrice());


                    logger.debug("Adding order item: itemId={}, quantity={}, unitPrice={}, totalPrice={}",
                            cartItem.getItemId(), cartItem.getQuantity(), cartItem.getUnitPrice(), cartItem.getTotalPrice());

                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setItems(orderItems);

        // Save order and return response
        Order savedOrder = orderRepository.save(order);
        logger.debug("Order saved successfully with id: {}", savedOrder.getId());

        return mapToOrderResponse(savedOrder);
    }

    // Retrieves a specific order by ID
    public OrderResponse getOrder(Long orderId) throws CustomException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));
        return mapToOrderResponse(order);
    }

    // Retrieves all orders placed by a user, sorted by newest first
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    // Retrieves only delivered orders for a user
    public List<OrderResponse> getUserDeliveredOrders(Long userId) {
        return orderRepository.findByUserIdAndStatus(userId, OrderStatus.DELIVERED).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }


    // Updates the status of an existing order
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) throws CustomException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));

        try {
            OrderStatus newStatus = OrderStatus.valueOf(request.getStatus());
            order.setStatus(newStatus);
            order.setUpdatedAt(LocalDateTime.now());
            return mapToOrderResponse(orderRepository.save(order));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + request.getStatus());
        }
    }

    // Deletes an order by ID
    @Transactional
    public void deleteOrder(Long orderId) throws CustomException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));
        orderRepository.delete(order);
    }

    // Retrieves bills for all paid orders of a user
    public List<BillResponse> getUserPaidBills(Long userId) {
        return orderRepository.findByUserIdAndPaymentStatus(userId, PaymentStatus.PAID).stream()
                .map(this::mapToBillResponse)
                .collect(Collectors.toList());
    }

    // Updates the payment status of an order
    @Transactional
    public OrderResponse updatePaymentStatus(Long orderId, PaymentStatus paymentStatus) throws CustomException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));

        order.setPaymentStatus(paymentStatus);
        order.setUpdatedAt(LocalDateTime.now());
        return mapToOrderResponse(orderRepository.save(order));
    }

    // Cancels an order if its status is still PENDING
    @Transactional
    public OrderResponse cancelOrderIfPending(Long orderId) throws CustomException {
        Logger logger = LoggerFactory.getLogger(getClass());
        logger.info("Attempting to cancel order with ID: {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    logger.error("Order not found with ID: {}", orderId);
                    return new CustomException(ExceptionCode.ORDER_NOT_FOUND);
                });

        if (order.getStatus() != OrderStatus.PENDING) {
            logger.error("Order ID {} is not in PENDING status. Current status: {}", orderId, order.getStatus());
            throw new IllegalStateException("Only orders with status PENDING can be cancelled.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());

        logger.info("Order ID {} successfully cancelled.", orderId);
        return mapToOrderResponse(orderRepository.save(order));
    }

    // Scheduled task: removes cancelled orders older than one hour
    @Scheduled(fixedRate = 60 * 60 * 1000) // Every hour
    @Transactional
    public void removeOldCancelledOrders() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Order> oldCancelledOrders = orderRepository.findByStatusAndUpdatedAtBefore(OrderStatus.CANCELLED, oneHourAgo);

        oldCancelledOrders.forEach(order -> {
            orderRepository.delete(order);
        });
    }

    // Converts an Order to a BillResponse DTO
    private BillResponse mapToBillResponse(Order order) {
        BillResponse response = new BillResponse();
        response.setOrderId(order.getId());
        response.setUserId(order.getUserId());
        response.setTotalAmount(order.getTotalAmount());
        response.setPaymentStatus(order.getPaymentStatus().toString());
        response.setCreatedAt(order.getCreatedAt());
        response.setBillingAddress(order.getDeliveryAddress());

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

    // Converts an Order entity to OrderResponse DTO
    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
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
}