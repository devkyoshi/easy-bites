package com.ds.masterservice.dto.request.user;

import com.ds.commons.dto.request.RegisterUserRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class RestaurantManagerRequestDTO extends RegisterUserRequest {
    @NotBlank(message = "License number is required")
    @Pattern(regexp = "^[A-Z0-9]{6,12}$", message = "License number must be 6-12 alphanumeric characters")
    private String licenseNumber;
}
