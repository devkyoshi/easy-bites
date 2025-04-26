package com.ds.masterservice.repository;

import com.ds.commons.enums.OrderStatus;
import com.ds.commons.enums.PaymentStatus;
import com.ds.masterservice.dao.Order;
import com.ds.masterservice.dto.response.OrderResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
    List<OrderResponse> findByStatus(OrderStatus status);
    List<Order> findByUserId(Long userId);
    List<Order> findByRestaurantId(Long restaurantId);
    List<Order> findByUserIdAndPaymentStatus(Long userId, PaymentStatus paymentStatus);
}