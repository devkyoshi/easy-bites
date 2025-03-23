package com.ds.authservice.dto.request;

import com.ds.authservice.models.ERole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String email;
    private Set<ERole> roles;
}
