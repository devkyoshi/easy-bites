package com.ds.masterservice.dto.request.orderService;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CreateOrderRequest {
    private Long cartId;
    private String deliveryAddress;
}