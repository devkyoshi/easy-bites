package com.ds.masterservice.dto.response;

import lombok.Data;

@Data
public class DeliveryResponse {
    private Long deliveryId;
    private Long orderId;
    private int driverId;
    private String status;
    private String notes;
    private String proofImage;
}
