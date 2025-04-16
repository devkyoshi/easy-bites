package com.ds.authservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class RegisterUserRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String email;
    private List<String> roles;
}
