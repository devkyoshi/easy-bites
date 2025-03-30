package com.ds.commons.template;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
@Setter
public class ApiResponse<T> extends ResponseEntity<T> {
    private String message;
    private boolean success;

    public ApiResponse(String message, boolean success, T result, HttpStatus status) {
        super(result, status);
        this.message = message;
        this.success = success;
    }

    public static <T> ApiResponse<T> successResponse(String message, T result) {
        return new ApiResponse<>(message, true, result, HttpStatus.OK);
    }

    public static <T> ApiResponse<T> successResponse(T result) {
        return new ApiResponse<>("", true, result, HttpStatus.OK);
    }

    public static <T> ApiResponse<T> errorResponse(String message, HttpStatus status) {
        return new ApiResponse<>(message, false, null, status);
    }
}
