package com.ds.masterservice.dto.request;

import lombok.Data;

@Data
public class DeliveryRatingRequest {
    private Integer rating; // 1-5
    private String comment;
}
