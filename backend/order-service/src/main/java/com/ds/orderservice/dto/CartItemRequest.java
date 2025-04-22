package com.ds.orderservice.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CartItemRequest {
    private Long itemId;
    private String itemName;
    private Integer quantity;
    private Double unitPrice;
}
