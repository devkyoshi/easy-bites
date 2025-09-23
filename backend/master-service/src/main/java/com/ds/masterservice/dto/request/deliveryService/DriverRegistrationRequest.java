package com.ds.masterservice.dto.request.deliveryService;

import com.ds.commons.dto.request.RegisterUserRequest;
import com.ds.commons.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;
    
    @NotBlank(message = "Vehicle number is required")
    @Pattern(regexp = "^[A-Z0-9-]{5,10}$", message = "Vehicle number must be 5-10 alphanumeric characters")
    private String vehicleNumber;
    
    @NotBlank(message = "License number is required")
    @Pattern(regexp = "^[A-Z0-9]{6,12}$", message = "License number must be 6-12 alphanumeric characters")
    private String licenseNumber;
}
