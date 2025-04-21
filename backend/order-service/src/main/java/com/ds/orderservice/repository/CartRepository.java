package com.ds.orderservice.repository;


import com.ds.orderservice.dao.Cart;
import com.ds.orderservice.dao.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserIdAndRestaurantIdAndStatus(Long userId, Long restaurantId, CartStatus status);
    Optional<Cart> findByUserIdAndStatus(Long userId, CartStatus status);
}