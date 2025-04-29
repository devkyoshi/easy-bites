package com.ds.masterservice.dto.response.deliveryService;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LocationUpdateResponse {
    private Long driverId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String message;
    private LocalDateTime timestamp;
}
