package com.ds.masterservice.dao.restaurantService;

import com.ds.masterservice.dao.authService.User;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("RESTAURANT_MANAGER")
@Getter
@Setter
public class RestaurantManager extends User {
    private String restaurantName;
    private String restaurantLocation;
    private String licenseNumber;
}
