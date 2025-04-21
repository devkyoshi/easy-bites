package com.ds.orderservice.dto;

import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private String status;
}