package com.ds.authservice.dto.request;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateDeliveryPersonDTO extends UpdateRegisterUserRequest {
    private String vehicleType;
    private String licenseNumber;
}
