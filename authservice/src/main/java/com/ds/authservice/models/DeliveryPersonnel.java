package com.ds.authservice.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "t_delivery_personnel")
@DiscriminatorValue("DELIVERY_PERSONNEL") // Optional
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPersonnel extends User {

    private String vehicleType;
    private String licenseNumber;

    @Builder
    public DeliveryPersonnel(String firstName, String lastName, String email, String password, String vehicleType, String licenseNumber, String username) {
        super(firstName, lastName, email, username, Set.of(ERole.ROLE_DELIVERY_PERSONNEL), password);
        this.vehicleType = vehicleType;
        this.licenseNumber = licenseNumber;
    }

    public static DeliveryPersonnelBuilder builder() {
        return new DeliveryPersonnelBuilder();
    }

    public static class DeliveryPersonnelBuilder extends User.UserBuilder {
        private String vehicleType;
        private String licenseNumber;

        public DeliveryPersonnelBuilder vehicleType(String vehicleType) {
            this.vehicleType = vehicleType;
            return this;
        }

        public DeliveryPersonnelBuilder licenseNumber(String licenseNumber) {
            this.licenseNumber = licenseNumber;
            return this;
        }

        @Override
        public DeliveryPersonnel build() {
            return new DeliveryPersonnel(firstName, lastName, email, password, vehicleType, licenseNumber, username);
        }
    }
}
