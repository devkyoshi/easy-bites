package com.ds.masterservice.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class DeliveryHistoryResponse {
    private Long id;
    private BigDecimal pickupLat;
    private BigDecimal pickupLng;
    private BigDecimal deliveryLat;
    private BigDecimal deliveryLng;
    private String status;
    private String notes;
    private String proofImage;
    private Integer rating;
    private String ratingComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Order details
    private Long orderId;
    private String deliveryAddress;
    private String restaurantName;

    // Driver details
    private Long driverId;
    private String driverName;
}
