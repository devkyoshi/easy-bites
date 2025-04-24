package com.ds.orderservice.repository;

import com.ds.orderservice.dao.Order;
import com.ds.orderservice.dao.OrderStatus;
import com.ds.orderservice.dao.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
    List<Order> findByUserId(Long userId);
    List<Order> findByRestaurantId(Long restaurantId);
    List<Order> findByUserIdAndPaymentStatus(Long userId, PaymentStatus paymentStatus);
    List<Order> findByStatusAndUpdatedAtBefore(OrderStatus status, LocalDateTime cutoffTime);

}