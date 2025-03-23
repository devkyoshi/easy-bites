package com.ds.authservice.dto.request;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRestaurantManagerDTO extends UpdateRegisterUserRequest {
    private String restaurantName;
    private String businessLicense;
}
