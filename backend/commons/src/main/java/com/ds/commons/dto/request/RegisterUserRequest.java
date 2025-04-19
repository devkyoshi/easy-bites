package com.ds.commons.dto.request;

import com.ds.commons.enums.UserType;
import lombok.Data;

import java.util.List;

@Data
public class RegisterUserRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String email;
    private UserType userType;
    private List<String> roles;
}
