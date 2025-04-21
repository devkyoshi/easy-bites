package com.ds.masterservice.dto.request;

import lombok.Data;

@Data
public class FoodItemRequest {
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private Integer stockQuantityPerDay;
    private Boolean isAvailable;
    private Long categoryId;

}
