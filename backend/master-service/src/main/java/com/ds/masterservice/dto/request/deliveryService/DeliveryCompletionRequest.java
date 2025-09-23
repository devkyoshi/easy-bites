package com.ds.masterservice.dto.request.deliveryService;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DeliveryCompletionRequest {
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
    
    private String proofImage;
    
    @NotNull(message = "Completion status is required")
    private boolean isCompleted;
}
