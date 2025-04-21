package com.ds.orderservice.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BillResponse {
    private Long orderId;
    private Long userId;
    private Long restaurantId;
    private String restaurantName;
    private List<OrderItemResponse> items;
    private double totalAmount;
    private String paymentStatus;
    private LocalDateTime createdAt;

    // You might want to add additional billing-specific fields
    private String billingAddress;
    private String paymentMethod; // If you track payment methods
}