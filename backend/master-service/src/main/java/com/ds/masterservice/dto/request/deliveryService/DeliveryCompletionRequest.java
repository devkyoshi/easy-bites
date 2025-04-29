package com.ds.masterservice.dto.request.deliveryService;

import lombok.Data;

@Data
public class DeliveryCompletionRequest {
    private String notes;
    private String proofImage;
    private boolean isCompleted;
}
