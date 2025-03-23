package com.ds.authservice.exceptions;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super(
           "Invalid Username or Password"
        );
    }
}
