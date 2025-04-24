package com.ds.commons.dto.request;

import com.ds.commons.enums.UserType;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String email;
    private UserType userType;
    private List<String> roles;
}