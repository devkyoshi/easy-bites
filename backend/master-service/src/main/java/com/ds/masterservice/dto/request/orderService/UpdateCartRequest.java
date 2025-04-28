package com.ds.masterservice.dto.request.orderService;

import lombok.Data;

import java.util.List;

@Data
public class UpdateCartRequest {
    private List<CartItemRequest> items;
}
