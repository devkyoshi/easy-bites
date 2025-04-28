package com.ds.masterservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WeeklyStatsResponse {
    private String day;
    private Long deliveryCount;
    private Double totalEarnings;
}
