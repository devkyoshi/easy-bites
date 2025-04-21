package com.ds.masterservice.dto.request;

import lombok.Data;

@Data
public class FoodItemCreateRequest {
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private Boolean isAvailable;
    private Long categoryId;
}