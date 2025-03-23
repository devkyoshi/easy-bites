package com.ds.authservice.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ApiResponse<T> {
    private String message;
    private boolean success;
    private T result;


    public static <T> ApiResponse<T> successResponse(String message, T result) {
        return new ApiResponse<>(message, true, result);
    }

    public static <T> ApiResponse<T> errorResponse(String message) {
        return new ApiResponse<>(message, false, null);
    }
}