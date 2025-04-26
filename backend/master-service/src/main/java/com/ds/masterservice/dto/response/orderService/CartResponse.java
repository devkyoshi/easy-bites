package com.ds.masterservice.dto.response.orderService;
import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    private Long id;
    private Long userId;
//    private Long restaurantId;
//    private  restaurantName;
    private List<CartItemResponse> items;
    private Double totalAmount;
    private String status;
}

