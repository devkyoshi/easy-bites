package com.ds.authservice.dto.response;

import com.ds.authservice.models.Customer;
import com.ds.authservice.models.DeliveryPersonnel;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DeliveryPersonResponse extends UserResponse{

    private String licenseNumber;
    private String vehicleType;

    public DeliveryPersonResponse(DeliveryPersonnel deliveryPersonnel) {
        super(deliveryPersonnel.getId(), deliveryPersonnel.getUsername(), deliveryPersonnel.getEmail(), deliveryPersonnel.getFirstName(), deliveryPersonnel.getLastName());
        this.licenseNumber = deliveryPersonnel.getLicenseNumber();
        this.vehicleType = deliveryPersonnel.getVehicleType();
    }
}
