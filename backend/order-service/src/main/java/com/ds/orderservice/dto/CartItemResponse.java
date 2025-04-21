package com.ds.orderservice.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CartItemResponse {
    private Long itemId;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
}
