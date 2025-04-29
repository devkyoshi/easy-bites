package com.ds.commons.exception;

public class NotFoundException extends ApiException {
    public NotFoundException(ExceptionCode code) {
        super(code);
    }
}
