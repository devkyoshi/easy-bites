package com.ds.masterservice.dao;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("RESTAURANT_MANAGER")
public class RestaurantManager extends User {
    private String restaurantName;
    private String restaurantLocation;
}
