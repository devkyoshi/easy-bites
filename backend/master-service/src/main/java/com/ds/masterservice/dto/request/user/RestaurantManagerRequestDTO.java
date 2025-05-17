package com.ds.masterservice.dto.request.user;

import com.ds.commons.dto.request.RegisterUserRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class RestaurantManagerRequestDTO extends RegisterUserRequest {
    private String licenseNumber;
}
