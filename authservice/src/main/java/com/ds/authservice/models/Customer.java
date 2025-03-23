package com.ds.authservice.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "t_customers")
@DiscriminatorValue("CUSTOMER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends User{
    private String address;
    private String phoneNumber;

    @Builder
    public Customer(String firstName, String lastName, String email, String password, String address, String phoneNumber, String username) {
        super( firstName, lastName, email, username, Set.of(ERole.ROLE_CUSTOMER), password);
        this.address = address;
        this.phoneNumber = phoneNumber;
    }

    public static CustomerBuilder builder() {
        return new CustomerBuilder();
    }

    public static class CustomerBuilder extends User.UserBuilder {
        private String address;
        private String phoneNumber;

        public CustomerBuilder address(String address) {
            this.address = address;
            return this;
        }

        public CustomerBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        @Override
        public Customer build() {
            return new Customer(firstName, lastName, email, password, address, phoneNumber, username);
        }
    }
}
