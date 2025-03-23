package com.ds.authservice.models;



import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "t_restaurant_managers")
@DiscriminatorValue("RESTAURANT_MANAGER") // Optional
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantManager extends User {

    private String restaurantName;
    private String businessLicense;

    @Builder
    public RestaurantManager( String firstName, String lastName, String email, String password, String restaurantName, String businessLicense, String username) {
        super(firstName, lastName, email, username, Set.of(ERole.ROLE_RESTAURANT_ADMIN), password);

        this.restaurantName = restaurantName;
        this.businessLicense = businessLicense;
    }

    public static RestaurantManagerBuilder builder() {
        return new RestaurantManagerBuilder();
    }

    public static class RestaurantManagerBuilder extends User.UserBuilder {
        private String restaurantName;
        private String businessLicense;

        public RestaurantManagerBuilder restaurantName(String restaurantName) {
            this.restaurantName = restaurantName;
            return this;
        }

        public RestaurantManagerBuilder businessLicense(String businessLicense) {
            this.businessLicense = businessLicense;
            return this;
        }

        @Override
        public RestaurantManager build() {
            return new RestaurantManager(firstName, lastName, email, password, restaurantName, businessLicense, username);
        }
    }
}
