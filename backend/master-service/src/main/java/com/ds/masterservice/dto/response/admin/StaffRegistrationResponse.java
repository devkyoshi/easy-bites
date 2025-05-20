package com.ds.masterservice.dto.response.admin;

import com.ds.masterservice.dao.authService.StaffRegistration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StaffRegistrationResponse {
    private Long id;
    private Boolean isApproved;
    private String createdAt;
    private UserResponse user;

    public StaffRegistrationResponse(StaffRegistration staffRegistration){
        this.id = staffRegistration.getId();
        this.isApproved = staffRegistration.getIsApproved();
        this.createdAt = staffRegistration.getCreatedAt().toString();
        this.user = UserResponse.builder()
                .id(staffRegistration.getUser().getId())
                .username(staffRegistration.getUser().getUsername())
                .email(staffRegistration.getUser().getEmail())
                .phoneNumber(staffRegistration.getUser().getPhone())
                .firstName(staffRegistration.getUser().getFirstName())
                .lastName(staffRegistration.getUser().getLastName())
                .role(staffRegistration.getUser().getRoles().getFirst().getName())
                .enabled(staffRegistration.getIsApproved())
                .build();
    }

}
