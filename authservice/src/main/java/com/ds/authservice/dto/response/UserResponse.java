package com.ds.authservice.dto.response;

import com.ds.authservice.models.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserResponse {
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;


    public UserResponse(Long userId, String username, String email, String firstName, String lastName) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public UserResponse(User user) {
        this.userId = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
    }
}
