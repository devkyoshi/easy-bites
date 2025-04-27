package com.ds.masterservice.dto.response.menu;

import com.ds.masterservice.dao.restaurantService.MenuCategory;
import lombok.Data;

@Data
public class MenuCategoryInitResponse {
    private Long categoryId;
    private String name;

    public MenuCategoryInitResponse() {
    }

    public MenuCategoryInitResponse(MenuCategory menuCategory) {
        this.categoryId = menuCategory.getId();
        this.name = menuCategory.getName();
    }
}
