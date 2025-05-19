package com.ds.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private int id;
    private String role;
    private boolean enabled;
    private String phoneNumber;
}
