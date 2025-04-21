package com.ds.orderservice.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class OrderItemResponse {
    private Long itemId;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
}