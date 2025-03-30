package com.ds.commons.exception;

public class CustomException extends Exception {
    public CustomException(ExceptionCode code) {
        super(code.getExceptionCode());
    }
}
