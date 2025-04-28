package com.ds.commons.exception;

public class NoContentException extends ApiException {
    public NoContentException(ExceptionCode code) {
        super(code);
    }
}
