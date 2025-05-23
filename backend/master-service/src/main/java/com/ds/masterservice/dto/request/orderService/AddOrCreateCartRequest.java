package com.ds.masterservice.dto.request.orderService;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class AddOrCreateCartRequest {
    private Long userId;
//    private Long restaurantId;
//    private String restaurantName;
    private List<CartItemRequest> items;
}