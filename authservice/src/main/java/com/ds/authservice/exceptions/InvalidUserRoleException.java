package com.ds.authservice.exceptions;

public class InvalidUserRoleException extends RuntimeException {
    public InvalidUserRoleException() {
        super("Invalid user role");
    }
}
