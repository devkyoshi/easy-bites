package com.ds.authservice.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RegisterResponse {

    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private List<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
