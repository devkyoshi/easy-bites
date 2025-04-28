package com.ds.masterservice.dto.request.orderService;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCheckoutSessionRequest {

    private Long orderId;
    private Double amount;
    private String description;
    private String successUrl;
    private String cancelUrl;
}
