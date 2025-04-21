package com.ds.masterservice.dto.response;

import lombok.Data;

@Data
public class MenuCategoryResponse {
    private Long categoryId;
    private String name;
    private Long restaurantId;
}
