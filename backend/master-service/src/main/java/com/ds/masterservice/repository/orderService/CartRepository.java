package com.ds.masterservice.repository.orderService;


import com.ds.masterservice.dao.orderService.Cart;
import com.ds.masterservice.dao.orderService.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserIdAndStatus(Long userId, CartStatus status);
}