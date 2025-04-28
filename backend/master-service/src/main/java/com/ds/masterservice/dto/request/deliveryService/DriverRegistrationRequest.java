package com.ds.masterservice.dto.request.deliveryService;

import com.ds.commons.dto.request.RegisterUserRequest;
import com.ds.commons.enums.VehicleType;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class DriverRegistrationRequest extends RegisterUserRequest {
    private VehicleType vehicleType;
    private String vehicleNumber;
    private String licenseNumber;
}
