package com.ds.orderservice.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AddCartItemRequest {
    private Long itemId;

    private String itemName;
    private String itemImage;
    private int quantity;
    private double unitPrice;


    // Getters and Setters
}
