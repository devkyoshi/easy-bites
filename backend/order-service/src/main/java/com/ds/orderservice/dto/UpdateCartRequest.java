package com.ds.orderservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdateCartRequest {
    private List<CartItemRequest> items;
}
