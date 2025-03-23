package com.ds.authservice.exceptions;

public class InvalidUserInputException extends RuntimeException {
    public InvalidUserInputException(String message) {
        super(
                "Missing fields: " + message
        );
    }
}
