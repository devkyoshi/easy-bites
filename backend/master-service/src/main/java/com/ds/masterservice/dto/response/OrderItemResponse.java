package com.ds.masterservice.dto.response;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {
    private Long itemId;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
    private String itemName;
    private String itemImage;
}