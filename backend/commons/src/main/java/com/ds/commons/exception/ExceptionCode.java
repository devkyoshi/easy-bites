package com.ds.commons.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ExceptionCode {
    USER_NOT_FOUND("USER_NOT_FOUND"),
    USER_ALREADY_EXISTS("USER_ALREADY_EXISTS"),
    USER_NOT_AUTHORIZED("USER_NOT_AUTHORIZED"),
    USER_NOT_AUTHENTICATED("USER_NOT_AUTHENTICATED"),
    USER_NOT_VALID("USER_NOT_VALID"),
    INVALID_DATE_FORMAT("INVALID_DATE_FORMAT"),
    INVALID_BUDGET("INVALID_BUDGET"),
    MISSING_REQUIRED_FIELDS("MISSING_REQUIRED_FIELDS");

    private final String exceptionCode;
}
