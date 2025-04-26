package com.ds.orderservice.dto;
import lombok.Data;

import java.util.List;


@Data
public class CreateCartRequest {
    private Long userId;
    private Long restaurantId;
    private String restaurantName;
    private List<CartItemRequest> items;
}

