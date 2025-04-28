package com.ds.masterservice.dto.response;

import com.ds.commons.dto.response.RegisterResponse;
import com.ds.masterservice.dao.DeliveryPerson;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@SuperBuilder
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class DriverResponse extends RegisterResponse {
    private Long driverID;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String licenseNumber;
    private String vehicleType;
    private String vehicleNumber;
    private boolean isAvailable;
}
