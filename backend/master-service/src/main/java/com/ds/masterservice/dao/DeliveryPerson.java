package com.ds.masterservice.dao;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("DELIVERY_PERSON")
public class DeliveryPerson extends User {
    private String vehicleType;
    private String licenseNumber;
}
