package com.ds.commons.exception;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {
    private final ExceptionCode code;

    public ApiException(ExceptionCode code) {
        super(code.getExceptionCode());
        this.code = code;
    }

}
