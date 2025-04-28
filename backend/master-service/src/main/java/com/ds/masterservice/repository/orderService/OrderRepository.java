package com.ds.masterservice.repository.orderService;

import com.ds.masterservice.dao.orderService.Order;
import com.ds.masterservice.dao.orderService.OrderStatus;
import com.ds.masterservice.dao.orderService.PaymentStatus;
import com.ds.masterservice.dto.response.orderService.OrderResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
    List<Order> findByUserId(Long userId);
    List<Order> findByStatus(OrderStatus status);
//    List<Order> findByRestaurantId(Long restaurantId);
    List<Order> findByUserIdAndPaymentStatus(Long userId, PaymentStatus paymentStatus);
    List<Order> findByStatusAndUpdatedAtBefore(OrderStatus status, LocalDateTime cutoffTime);

}