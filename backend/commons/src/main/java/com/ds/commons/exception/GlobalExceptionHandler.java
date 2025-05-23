package com.ds.commons.exception;

import com.ds.commons.template.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = "com.ds")
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<?>> handleServiceException(CustomException ex) {
        log.error("ServiceException: {}", ex.getMessage());
        return new ResponseEntity<>(
                ApiResponse.errorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleNotFound(NotFoundException ex) {
        log.error("NotFoundException: {}", ex.getMessage());
        return new ResponseEntity<>(
                ApiResponse.errorResponse(ex.getMessage(), HttpStatus.NOT_FOUND),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(NoContentException.class)
    public ResponseEntity<ApiResponse<?>> handleNoContent(NoContentException ex) {
        return ResponseEntity.ok(ApiResponse.successResponse(ex.getMessage(), null));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ApiResponse<String> handleAuthenticationException(AuthenticationException ex) {
        log.error("AuthenticationException: {}", ex.getMessage());
        return ApiResponse.errorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<String> handleExpiredJwtException(ExpiredJwtException ex) {
        log.error("ExpiredJwtException: {}", ex.getMessage());
        return new ResponseEntity<>("Token has expired", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ApiResponse<String> handleAuthorizationDeniedException(AuthorizationDeniedException ex) {
        log.error("AuthorizationDeniedException: {}", ex.getMessage());
        return ApiResponse.errorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<String> handleGenericException(Exception ex) {
        log.error("Exception: {}", ex.getMessage());
        return ApiResponse.errorResponse(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
