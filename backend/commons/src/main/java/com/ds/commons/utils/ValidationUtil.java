package com.ds.commons.utils;

import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;

import java.util.regex.Pattern;

public class ValidationUtil {
    private static final Pattern STRONG_PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{12,}$");

    public static void validatePassword(String rawPassword) throws CustomException {
        if (rawPassword == null || !STRONG_PASSWORD_PATTERN.matcher(rawPassword).matches()) {
            throw new CustomException(ExceptionCode.WEAK_PASSWORD);
        }
    }
}
