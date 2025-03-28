package com.ds.authservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRegisterDeliveryPersonnelRequest extends UpdateRegisterUserRequest {
    private String vehicleType;
    private String licenseNumber;
}
