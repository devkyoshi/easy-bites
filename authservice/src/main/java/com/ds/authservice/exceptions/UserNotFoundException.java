package com.ds.authservice.exceptions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(Long id) {
        super(
            "User with id " + id + " not found"
        );
    }


}
