package com.ds.authservice.dto;

import lombok.Data;

@Data
public class UserResponseDTO {
    private String username;
    private String email;
    private String role;
}
