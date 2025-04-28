package com.ds.masterservice.dto.response.orderService;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class OrderItemResponse {
    private Long itemId;
    private String itemName;
    private String itemImage;
    private Long restaurantId;
    private String restaurantName;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
}