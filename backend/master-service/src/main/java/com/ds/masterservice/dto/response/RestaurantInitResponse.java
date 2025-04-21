package com.ds.masterservice.dto.response;

import com.ds.masterservice.dao.Restaurant;
import lombok.Data;

/**
 * This holds the response for the dashboard visualization
 * (meaning only required fields for minimal info are there)
 */
@Data
public class RestaurantInitResponse {
    private Long restaurantId;
    private String name;
    private String description;
    private String logoUrl;
    private Boolean isOpen;


    public RestaurantInitResponse(){}

    public RestaurantInitResponse(Restaurant restaurant) {
        this.restaurantId = restaurant.getId();
        this.name = restaurant.getName();
        this.description = restaurant.getDescription();
        this.logoUrl = restaurant.getLogoUrl();
        this.isOpen = restaurant.getIsOpen();
    }
}

