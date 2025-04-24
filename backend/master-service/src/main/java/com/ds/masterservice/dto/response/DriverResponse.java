package com.ds.masterservice.dto.response;

import com.ds.commons.dto.response.RegisterResponse;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class DriverResponse extends RegisterResponse {
    private String vehicleType;
    private String vehicleNumber;
    private boolean isAvailable;
}
