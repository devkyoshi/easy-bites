package com.ds.masterservice.dto.response;

import com.ds.masterservice.dao.MenuCategory;
import lombok.Data;

@Data
public class MenuCategoryResponse {
    private Long categoryId;
    private String name;
    private Long restaurantId;

    public MenuCategoryResponse() {
    }

    public MenuCategoryResponse(MenuCategory menuCategory) {
        this.categoryId = menuCategory.getId();
        this.name = menuCategory.getName();
        this.restaurantId = menuCategory.getRestaurant().getId();
    }
}
