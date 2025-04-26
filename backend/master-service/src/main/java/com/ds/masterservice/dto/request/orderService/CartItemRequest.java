package com.ds.masterservice.dto.request.orderService;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CartItemRequest {
    private Long itemId;
    private String itemName;
    private String itemImage;
    private Long restaurantId;
    private String restaurantName;
    private Integer quantity;
    private Double unitPrice;
}
