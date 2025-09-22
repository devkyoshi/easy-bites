package com.ds.commons.template;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;


@Getter
@Setter
public class ApiResponse<T>  {
    private String message;
    private boolean success;
    private T result;
    private HttpStatus status;

    public ApiResponse(String message, boolean success, T result, HttpStatus status) {
        this.result = result;
        this.message = message;
        this.success = success;
        this.status = status;
    }

    public static <T> ApiResponse<T> successResponse(String message, T result) {
        return new ApiResponse<>(message, true, result, HttpStatus.OK);
    }

    public static <T> ApiResponse<T> createdSuccessResponse(String message, T result) {
        return new ApiResponse<>(message, true, result,  HttpStatus.CREATED);
    }

    public static <T> ApiResponse<T> successResponse(T result) {
        return new ApiResponse<>("", true, result, HttpStatus.OK);
    }

    public static <T> ApiResponse<T> errorResponse(String message, HttpStatus status) {
        return new ApiResponse<>(message, false, null, status);
    }

    // Added overload to support error responses with a payload (e.g., validation errors map)
    public static <T> ApiResponse<T> errorResponse(String message, T result, HttpStatus status) {
        return new ApiResponse<>(message, false, result, status);
    }
}
