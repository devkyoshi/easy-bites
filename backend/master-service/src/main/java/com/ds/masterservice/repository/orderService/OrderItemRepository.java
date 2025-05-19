package com.ds.masterservice.repository.orderService;

import com.ds.masterservice.dao.orderService.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByRestaurantId(Long restaurantId);
}
