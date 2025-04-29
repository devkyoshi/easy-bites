package com.ds.masterservice.dto.response.deliveryService;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class DeliveryResponse {
    private Long deliveryId;
    private Long orderId;
    private int driverId;
    private String status;
    private String notes;
    private String proofImage;
    private Integer rating;
    private String ratingComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BigDecimal PickupLat;
    private BigDecimal PickupLng;
    private BigDecimal DeliveryLat;
    private BigDecimal DeliveryLng;
}
