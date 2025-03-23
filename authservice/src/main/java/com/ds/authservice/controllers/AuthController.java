package com.ds.authservice.controllers;

import com.ds.authservice.dto.request.LoginRequest;
import com.ds.authservice.dto.request.UpdateRegisterCustomerRequest;
import com.ds.authservice.dto.request.UpdateRegisterDeliveryPersonnelRequest;
import com.ds.authservice.dto.request.UpdateRegisterRestaurantManagerRequest;
import com.ds.authservice.dto.response.LoginResponse;
import com.ds.authservice.dto.response.UserResponse;
import com.ds.authservice.services.AuthService;
import com.ds.authservice.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register/customer")
    public ResponseEntity<ApiResponse<UserResponse>> registerCustomer(@RequestBody UpdateRegisterCustomerRequest request) {
        log.info("Attempting to register customer with username: {}", request.getUsername());
        return ResponseEntity.ok(authService.registerUser(request));
    }

    @PostMapping("/register/restaurant-manager")
    public ResponseEntity<ApiResponse<UserResponse>> registerRestaurantManager(@RequestBody UpdateRegisterRestaurantManagerRequest request) {
        log.info("Attempting to register restaurant manager: {} ", request.getUsername());
        return ResponseEntity.ok(authService.registerUser(request));
    }

    @PostMapping("/register/delivery-personnel")
    public ResponseEntity<ApiResponse<UserResponse>> registerDeliveryPersonnel(@RequestBody UpdateRegisterDeliveryPersonnelRequest request) {
        log.info("Attempting to register delivery-personnel: {} ", request.getUsername());
        return ResponseEntity.ok(authService.registerUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        log.info("Attempting to login: {}", request.getUsername());
        return ResponseEntity.ok(authService.login(request));
    }
}
