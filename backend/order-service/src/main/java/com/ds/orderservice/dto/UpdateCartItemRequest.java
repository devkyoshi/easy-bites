package com.ds.orderservice.dto;

import lombok.Data;

@Data
public class UpdateCartItemRequest {
    private Long itemId;
    private int quantity;

    // Getters and Setters
}
