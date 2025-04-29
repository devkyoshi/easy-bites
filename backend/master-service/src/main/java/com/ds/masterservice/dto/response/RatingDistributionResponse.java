package com.ds.masterservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RatingDistributionResponse {
    private Integer rating;
    private Long count;
}
