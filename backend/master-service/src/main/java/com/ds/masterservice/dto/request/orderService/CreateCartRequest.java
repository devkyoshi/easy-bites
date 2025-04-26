package com.ds.masterservice.dto.request.orderService;
import lombok.Data;

import java.util.List;


@Data
public class CreateCartRequest {
    private Long userId;
//    private Long restaurantId;
//    private String restaurantName;
    private List<CartItemRequest> items;
}

