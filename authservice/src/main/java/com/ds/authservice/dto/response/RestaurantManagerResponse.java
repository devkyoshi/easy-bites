package com.ds.authservice.dto.response;

import com.ds.authservice.models.RestaurantManager;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class RestaurantManagerResponse extends UserResponse{

    private String businessName;
    private String businessLicense;

    public RestaurantManagerResponse(RestaurantManager restaurantManager) {
        super(restaurantManager.getId(), restaurantManager.getUsername(), restaurantManager.getEmail(), restaurantManager.getFirstName(), restaurantManager.getLastName());
        this.businessName = restaurantManager.getRestaurantName();
        this.businessLicense = restaurantManager.getBusinessLicense();
    }
}
