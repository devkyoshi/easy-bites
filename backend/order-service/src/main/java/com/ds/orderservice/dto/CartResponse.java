package com.ds.orderservice.dto;
import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    private Long id;
    private Long userId;
    private Long restaurantId;
    private String restaurantName;
    private List<CartItemResponse> items;
    private Double totalAmount;
    private String status;
}

