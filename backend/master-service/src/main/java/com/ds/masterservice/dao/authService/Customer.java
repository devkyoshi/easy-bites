package com.ds.masterservice.dao.authService;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("CUSTOMER")
public class Customer extends User {
    private String address;
    private String preferredPaymentMethod;
}
