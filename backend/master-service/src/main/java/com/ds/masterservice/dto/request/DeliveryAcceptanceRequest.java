package com.ds.masterservice.dto.request;

import lombok.Data;

@Data
public class DeliveryAcceptanceRequest {
    private Long orderId;
    private Double currentLat;
    private Double currentLng;
}
