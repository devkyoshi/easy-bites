package com.ds.masterservice.dto.response.orderService;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
public class OrderResponse {
    private Long id;
    private Long userId;
//    private Long restaurantId;
//    private  restaurantName;
    private List<OrderItemResponse> items;
    private double totalAmount;
    private String status;
    private String paymentStatus;
    private String deliveryAddress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}